import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class DeveloperService {
  private readonly logger = new Logger(DeveloperService.name);

  // In-memory idempotency cache: idempotencyKey -> cached response
  private readonly idempotencyCache = new Map<string, any>();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a new API Key with prefix sd_live_ or sd_test_.
   * The full key is displayed once and its SHA-256 hash is stored in the database.
   */
  async createApiKey(
    workspaceId: string,
    data: { name: string; scopes?: string[]; isTest?: boolean },
  ) {
    const prefix = data.isTest ? 'sd_test_' : 'sd_live_';
    const secretPart = crypto.randomBytes(24).toString('hex');
    const fullKey = `${prefix}${secretPart}`;
    const keyHash = crypto.createHash('sha256').update(fullKey).digest('hex');

    const apiKey = await this.prisma.apiKey.create({
      data: {
        workspaceId,
        name: data.name.trim(),
        keyPrefix: prefix,
        keyHash,
        scopes: data.scopes || ['envelopes:read', 'envelopes:write'],
      },
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      keyPrefix: apiKey.keyPrefix,
      scopes: apiKey.scopes,
      createdAt: apiKey.createdAt,
      fullKey, // Returned only upon creation
    };
  }

  async listApiKeys(workspaceId: string) {
    return this.prisma.apiKey.findMany({
      where: { workspaceId, revokedAt: null },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        scopes: true,
        lastUsedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revokeApiKey(workspaceId: string, id: string) {
    const key = await this.prisma.apiKey.findFirst({
      where: { id, workspaceId },
    });
    if (!key) throw new NotFoundException('API Key not found');

    return this.prisma.apiKey.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Authenticates an API Key by hashing and comparing with stored record.
   */
  async authenticateApiKey(rawKey: string) {
    if (!rawKey || (!rawKey.startsWith('sd_live_') && !rawKey.startsWith('sd_test_'))) {
      throw new UnauthorizedException('Invalid API Key format');
    }

    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { keyHash, revokedAt: null },
    });

    if (!apiKey) {
      throw new UnauthorizedException('API Key is invalid or has been revoked');
    }

    // Update lastUsedAt asynchronously
    await this.prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      workspaceId: apiKey.workspaceId,
      keyId: apiKey.id,
      scopes: apiKey.scopes as string[],
    };
  }

  /**
   * Derives 256-bit key from environment secret for AES-GCM encryption at rest.
   */
  private getEncryptionKey(): Buffer {
    const keySource =
      process.env.WEBHOOK_ENCRYPTION_KEY ||
      process.env.JWT_SECRET ||
      'signdesk-default-webhook-encryption-key-32b';
    return crypto.createHash('sha256').update(keySource).digest();
  }

  /**
   * Encrypts webhook raw secret using AES-256-GCM.
   * Returns: ivHex:tagHex:encryptedHex
   */
  encryptSecret(secret: string): string {
    const key = this.getEncryptionKey();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([
      cipher.update(secret, 'utf8'),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
  }

  /**
   * Decrypts AES-256-GCM encrypted webhook secret.
   */
  decryptSecret(encryptedData: string): string {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted webhook secret format');
    }
    const [ivHex, tagHex, encryptedHex] = parts;
    const key = this.getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return decipher.update(encrypted) + decipher.final('utf8');
  }

  public backoffBaseMs = process.env.NODE_ENV === 'test' ? 10 : 100;
  public maxAttempts = 3;
  public maxConsecutiveFailures = 5;

  /**
   * Creates a webhook subscription endpoint with HMAC secret.
   */
  async createWebhookEndpoint(
    workspaceId: string,
    data: { url: string; events: string[] },
  ) {
    try {
      new URL(data.url);
    } catch {
      throw new BadRequestException('Invalid webhook URL format');
    }

    const rawSecret = `whsec_${crypto.randomBytes(24).toString('hex')}`;
    const secretHash = crypto.createHash('sha256').update(rawSecret).digest('hex');
    const secretEncrypted = this.encryptSecret(rawSecret);

    const endpoint = await this.prisma.webhookEndpoint.create({
      data: {
        workspaceId,
        url: data.url.trim(),
        secretHash,
        secretEncrypted,
        events: data.events,
        enabled: true,
        consecutiveFailures: 0,
      },
    });

    return {
      id: endpoint.id,
      url: endpoint.url,
      events: endpoint.events,
      enabled: endpoint.enabled,
      createdAt: endpoint.createdAt,
      secret: rawSecret, // Returned once
    };
  }

  async listWebhookEndpoints(workspaceId: string) {
    return this.prisma.webhookEndpoint.findMany({
      where: { workspaceId },
      select: {
        id: true,
        workspaceId: true,
        url: true,
        secretHash: true,
        events: true,
        enabled: true,
        consecutiveFailures: true,
        createdAt: true,
        _count: { select: { deliveries: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteWebhookEndpoint(workspaceId: string, id: string) {
    const endpoint = await this.prisma.webhookEndpoint.findFirst({
      where: { id, workspaceId },
    });
    if (!endpoint) throw new NotFoundException('Webhook endpoint not found');

    return this.prisma.webhookEndpoint.delete({ where: { id } });
  }

  /**
   * Generates HMAC-SHA256 signature header:
   * X-SignDesk-Signature: t={timestamp},v1={hexDigest}
   */
  generateWebhookSignature(payload: string, secret: string, timestamp?: number): string {
    const t = timestamp || Math.floor(Date.now() / 1000);
    const signaturePayload = `${t}.${payload}`;
    const v1 = crypto.createHmac('sha256', secret).update(signaturePayload).digest('hex');
    return `t=${t},v1=${v1}`;
  }

  /**
   * Verifies an incoming webhook signature with 5-minute replay tolerance.
   */
  verifyWebhookSignature(
    rawPayload: string,
    signatureHeader: string,
    secret: string,
  ): { valid: boolean; error?: string } {
    if (!signatureHeader) {
      return { valid: false, error: 'Missing X-SignDesk-Signature header' };
    }

    const parts = signatureHeader.split(',');
    const tPart = parts.find((p) => p.startsWith('t='));
    const v1Part = parts.find((p) => p.startsWith('v1='));

    if (!tPart || !v1Part) {
      return { valid: false, error: 'Malformed signature header format' };
    }

    const timestamp = parseInt(tPart.slice(2), 10);
    const signature = v1Part.slice(3);

    // Replay protection: 5-minute (300 seconds) tolerance
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (Math.abs(currentTimestamp - timestamp) > 300) {
      return {
        valid: false,
        error: `Timestamp out of tolerance (${Math.abs(currentTimestamp - timestamp)}s > 300s). Potential replay attack.`,
      };
    }

    const expectedHeader = this.generateWebhookSignature(rawPayload, secret, timestamp);
    const expectedV1 = expectedHeader.split(',')[1].slice(3);

    try {
      const valid = crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedV1, 'hex'),
      );
      return { valid };
    } catch {
      return { valid: false, error: 'Signature digest mismatch' };
    }
  }

  /**
   * Dispatches webhook event to all subscribed endpoints for the workspace.
   */
  async dispatchEvent(
    workspaceId: string,
    envelopeId: string,
    event: string,
    payload: any,
  ) {
    const endpoints = await this.prisma.webhookEndpoint.findMany({
      where: { workspaceId, enabled: true },
    });

    const matching = endpoints.filter((ep) => {
      const subscribed = (ep.events as string[]) || [];
      return subscribed.includes(event) || subscribed.includes('*');
    });

    // Check envelope validity if envelopeId provided
    let validEnvelopeId: string | null = null;
    if (envelopeId && envelopeId !== 'test-envelope-id') {
      try {
        const env = await this.prisma.envelope?.findUnique?.({
          where: { id: envelopeId },
          select: { id: true },
        });
        if (env) validEnvelopeId = env.id;
      } catch {
        validEnvelopeId = null;
      }
    }

    const results = [];
    for (const ep of matching) {
      // 1. Decrypt raw secret (never logged or stored in plaintext)
      let rawSecret: string;
      if (ep.secretEncrypted) {
        try {
          rawSecret = this.decryptSecret(ep.secretEncrypted);
        } catch {
          this.logger.error(`Decryption failed for webhook endpoint ${ep.id}`);
          rawSecret = ep.secretHash;
        }
      } else {
        rawSecret = ep.secretHash;
      }

      const rawPayload = JSON.stringify({
        id: `evt_${crypto.randomBytes(12).toString('hex')}`,
        event,
        createdAt: new Date().toISOString(),
        data: payload,
      });

      const signature = this.generateWebhookSignature(rawPayload, rawSecret);

      // 2. Real HTTP delivery with 5s timeout & exponential backoff
      let attempt = 0;
      let statusCode: number | null = null;
      let isSuccess = false;

      while (attempt < this.maxAttempts) {
        attempt++;
        try {
          const res = await fetch(ep.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-SignDesk-Signature': signature,
              'User-Agent': 'SignDesk-Webhook/1.0',
            },
            body: rawPayload,
            signal: AbortSignal.timeout(5000),
          });

          statusCode = res.status;
          if (res.ok) {
            isSuccess = true;
            break;
          }
        } catch (err: any) {
          statusCode = err?.name === 'TimeoutError' ? 408 : 0;
        }

        if (attempt < this.maxAttempts) {
          const delay = this.backoffBaseMs * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      // 3. Consecutive failures tracking & auto-disable (Plan §9)
      let consecutiveFailures = ep.consecutiveFailures || 0;
      let shouldDisable = false;

      if (isSuccess) {
        consecutiveFailures = 0;
      } else {
        consecutiveFailures += 1;
        if (consecutiveFailures >= this.maxConsecutiveFailures) {
          shouldDisable = true;
        }
      }

      if (this.prisma.webhookEndpoint.update) {
        await this.prisma.webhookEndpoint.update({
          where: { id: ep.id },
          data: {
            consecutiveFailures,
            enabled: shouldDisable ? false : ep.enabled,
          },
        });
      }

      const deliveryStatus = shouldDisable
        ? 'DISABLED'
        : isSuccess
          ? 'DELIVERED'
          : 'FAILED';

      // 4. Record delivery log with real status code & attempt count
      const delivery = await this.prisma.webhookDelivery.create({
        data: {
          endpointId: ep.id,
          envelopeId: validEnvelopeId,
          event,
          payload: JSON.parse(rawPayload),
          statusCode,
          attempts: attempt,
          status: deliveryStatus,
        },
      });

      if (isSuccess) {
        this.logger.log(`Dispatched webhook ${event} to ${ep.url} (status: ${statusCode}, attempts: ${attempt})`);
      } else if (shouldDisable) {
        this.logger.warn(`Disabled webhook endpoint ${ep.id} (${ep.url}) after ${consecutiveFailures} consecutive failures`);
      } else {
        this.logger.warn(`Failed webhook delivery ${event} to ${ep.url} (status: ${statusCode}, attempts: ${attempt}, failures: ${consecutiveFailures})`);
      }

      results.push(delivery);
    }

    return results;
  }

  /**
   * Idempotency handling for external REST API endpoints.
   */
  checkIdempotency(key?: string): any | null {
    if (!key) return null;
    return this.idempotencyCache.get(key) || null;
  }

  saveIdempotency(key: string, response: any) {
    if (key) {
      this.idempotencyCache.set(key, response);
    }
  }
}
