import { DeveloperService } from './developer.service';
import { UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as http from 'http';
import { AddressInfo } from 'net';

describe('DeveloperService (Phase 9 - External API & Webhooks)', () => {
  let service: DeveloperService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      apiKey: {
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'key-1', ...args.data, createdAt: new Date() })),
        findFirst: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
        update: jest.fn().mockResolvedValue({ id: 'key-1' }),
      },
      webhookEndpoint: {
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'wh-1', ...args.data, createdAt: new Date() })),
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn(),
        delete: jest.fn().mockResolvedValue({ id: 'wh-1' }),
        update: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.where.id, ...args.data })),
      },
      webhookDelivery: {
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'del-1', ...args.data })),
      },
      envelope: {
        findUnique: jest.fn().mockResolvedValue({ id: 'env-123' }),
      },
    };

    service = new DeveloperService(mockPrisma);
    service.backoffBaseMs = 1; // Instant backoff for unit tests
  });

  it('creates an API key with sd_live_ prefix and verifies hash authentication', async () => {
    const created = await service.createApiKey('ws-1', { name: 'Zapier Integration' });

    expect(created.fullKey).toMatch(/^sd_live_[0-9a-f]{48}$/);
    expect(mockPrisma.apiKey.create).toHaveBeenCalled();

    // Authenticate with the created key
    const expectedHash = crypto.createHash('sha256').update(created.fullKey).digest('hex');
    mockPrisma.apiKey.findFirst.mockResolvedValueOnce({
      id: 'key-1',
      workspaceId: 'ws-1',
      keyHash: expectedHash,
      scopes: ['envelopes:read', 'envelopes:write'],
      revokedAt: null,
    });

    const auth = await service.authenticateApiKey(created.fullKey);
    expect(auth.workspaceId).toBe('ws-1');
  });

  it('rejects invalid or revoked API key with UnauthorizedException', async () => {
    mockPrisma.apiKey.findFirst.mockResolvedValueOnce(null);

    await expect(
      service.authenticateApiKey('sd_live_0123456789abcdef0123456789abcdef0123456789abcdef'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('stores webhook secret encrypted at rest (AES-256-GCM) and verifies decryption', async () => {
    const created = await service.createWebhookEndpoint('ws-1', {
      url: 'https://example.com/webhook',
      events: ['envelope.completed'],
    });

    expect(created.secret).toMatch(/^whsec_[0-9a-f]{48}$/);
    expect(mockPrisma.webhookEndpoint.create).toHaveBeenCalled();

    const createCallArgs = mockPrisma.webhookEndpoint.create.mock.calls[0][0];
    const stored = createCallArgs.data;

    // Must store secretHash AND secretEncrypted
    expect(stored.secretHash).toBeDefined();
    expect(stored.secretEncrypted).toBeDefined();

    // Never store raw secret in plaintext
    expect(stored.secretEncrypted).not.toContain(created.secret);
    expect(stored.secretEncrypted.split(':')).toHaveLength(3); // iv:tag:ciphertext

    // Decrypts back to the raw secret using AES-GCM
    const decrypted = service.decryptSecret(stored.secretEncrypted);
    expect(decrypted).toBe(created.secret);
  });

  it('signs and verifies webhook HMAC-SHA256 signature', () => {
    const secret = crypto.randomBytes(32).toString('hex');
    const payload = JSON.stringify({ event: 'envelope.completed', envelopeId: 'env-123' });

    const header = service.generateWebhookSignature(payload, secret);
    expect(header).toMatch(/^t=\d+,v1=[0-9a-f]{64}$/);

    const verification = service.verifyWebhookSignature(payload, header, secret);
    expect(verification.valid).toBe(true);
  });

  it('replay protection: rejects webhook signatures older than 5 minutes (300 seconds)', () => {
    const secret = crypto.randomBytes(32).toString('hex');
    const payload = JSON.stringify({ event: 'envelope.completed', envelopeId: 'env-123' });

    // 10 minutes ago
    const oldTimestamp = Math.floor(Date.now() / 1000) - 600;
    const oldHeader = service.generateWebhookSignature(payload, secret, oldTimestamp);

    const verification = service.verifyWebhookSignature(payload, oldHeader, secret);
    expect(verification.valid).toBe(false);
    expect(verification.error).toContain('tolerance');
  });

  it('idempotency: caches and returns saved response for identical key', () => {
    const key = 'idem_12345_test';
    const response = { id: 'env-created-once', status: 'DRAFT' };

    expect(service.checkIdempotency(key)).toBeNull();

    service.saveIdempotency(key, response);

    expect(service.checkIdempotency(key)).toEqual(response);
  });

  describe('Integration: Real Webhook HTTP Delivery & Signature Verification', () => {
    let server: http.Server;
    let serverUrl: string;
    let receivedRequests: Array<{ method?: string; headers: http.IncomingHttpHeaders; body: string }> = [];
    let serverResponseStatus = 200;

    beforeAll(async () => {
      server = http.createServer((req, res) => {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          receivedRequests.push({
            method: req.method,
            headers: req.headers,
            body,
          });
          res.writeHead(serverResponseStatus, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: serverResponseStatus }));
        });
      });

      await new Promise<void>((resolve) => {
        server.listen(0, '127.0.0.1', () => {
          const addr = server.address() as AddressInfo;
          serverUrl = `http://127.0.0.1:${addr.port}/webhook-listener`;
          resolve();
        });
      });
    });

    afterAll(async () => {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
    });

    beforeEach(() => {
      receivedRequests = [];
      serverResponseStatus = 200;
    });

    it('dispatches real HTTP payload, verifies signature with raw secret, and rejects replayed payload', async () => {
      // 1. Create webhook endpoint with AES-GCM encrypted secret
      const rawSecret = `whsec_${crypto.randomBytes(24).toString('hex')}`;
      const encryptedSecret = service.encryptSecret(rawSecret);
      const secretHash = crypto.createHash('sha256').update(rawSecret).digest('hex');

      mockPrisma.webhookEndpoint.findMany.mockResolvedValueOnce([
        {
          id: 'wh-ep-100',
          workspaceId: 'ws-1',
          url: serverUrl,
          secretHash,
          secretEncrypted: encryptedSecret,
          events: ['envelope.completed'],
          enabled: true,
          consecutiveFailures: 0,
        },
      ]);

      const testPayload = {
        envelopeId: 'env-123',
        title: 'Commercial Supply Contract',
        finalHash: 'a6b7c8d9e0f1...',
      };

      // 2. Trigger dispatchEvent
      const deliveries = await service.dispatchEvent('ws-1', 'env-123', 'envelope.completed', testPayload);

      expect(deliveries).toHaveLength(1);
      expect(mockPrisma.webhookDelivery.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            endpointId: 'wh-ep-100',
            event: 'envelope.completed',
            statusCode: 200,
            attempts: 1,
            status: 'DELIVERED',
          }),
        }),
      );

      // 3. Assert HTTP listener received the payload
      expect(receivedRequests).toHaveLength(1);
      const received = receivedRequests[0];
      expect(received.method).toBe('POST');
      expect(received.headers['content-type']).toContain('application/json');

      const parsedBody = JSON.parse(received.body);
      expect(parsedBody.event).toBe('envelope.completed');
      expect(parsedBody.data).toEqual(testPayload);

      // 4. Assert signature header verifies with the RAW secret
      const signatureHeader = received.headers['x-signdesk-signature'] as string;
      expect(signatureHeader).toBeDefined();

      const verification = service.verifyWebhookSignature(received.body, signatureHeader, rawSecret);
      expect(verification.valid).toBe(true);

      // 5. Assert a replayed (old-timestamp) payload is rejected
      const oldTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago
      const replayedHeader = service.generateWebhookSignature(received.body, rawSecret, oldTimestamp);
      const replayVerification = service.verifyWebhookSignature(received.body, replayedHeader, rawSecret);
      expect(replayVerification.valid).toBe(false);
      expect(replayVerification.error).toContain('tolerance');
    });

    it('retries with exponential backoff on HTTP failure and records real status code', async () => {
      serverResponseStatus = 500;
      service.backoffBaseMs = 5; // Fast backoff

      const rawSecret = `whsec_${crypto.randomBytes(24).toString('hex')}`;
      const encryptedSecret = service.encryptSecret(rawSecret);

      mockPrisma.webhookEndpoint.findMany.mockResolvedValueOnce([
        {
          id: 'wh-ep-500',
          workspaceId: 'ws-1',
          url: serverUrl,
          secretHash: 'hash-500',
          secretEncrypted: encryptedSecret,
          events: ['envelope.signed'],
          enabled: true,
          consecutiveFailures: 1,
        },
      ]);

      await service.dispatchEvent('ws-1', 'env-123', 'envelope.signed', { signer: 'Karim' });

      // Max attempts = 3
      expect(receivedRequests).toHaveLength(3);
      expect(mockPrisma.webhookDelivery.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            statusCode: 500,
            attempts: 3,
            status: 'FAILED',
          }),
        }),
      );

      // Consecutive failures incremented
      expect(mockPrisma.webhookEndpoint.update).toHaveBeenCalledWith({
        where: { id: 'wh-ep-500' },
        data: {
          consecutiveFailures: 2,
          enabled: true,
        },
      });
    });

    it('disables webhook endpoint after N consecutive failures (Plan §9)', async () => {
      serverResponseStatus = 503;
      service.backoffBaseMs = 1;
      service.maxConsecutiveFailures = 5;

      const rawSecret = `whsec_${crypto.randomBytes(24).toString('hex')}`;
      const encryptedSecret = service.encryptSecret(rawSecret);

      // Endpoint already had 4 consecutive failures
      mockPrisma.webhookEndpoint.findMany.mockResolvedValueOnce([
        {
          id: 'wh-ep-critical',
          workspaceId: 'ws-1',
          url: serverUrl,
          secretHash: 'hash-crit',
          secretEncrypted: encryptedSecret,
          events: ['*'],
          enabled: true,
          consecutiveFailures: 4,
        },
      ]);

      await service.dispatchEvent('ws-1', 'env-123', 'envelope.voided', { reason: 'Voided' });

      // Hits threshold of 5 failures -> auto-disable
      expect(mockPrisma.webhookEndpoint.update).toHaveBeenCalledWith({
        where: { id: 'wh-ep-critical' },
        data: {
          consecutiveFailures: 5,
          enabled: false,
        },
      });

      expect(mockPrisma.webhookDelivery.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'DISABLED',
            attempts: 3,
            statusCode: 503,
          }),
        }),
      );
    });
  });
});
