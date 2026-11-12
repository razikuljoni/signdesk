import { DeveloperService } from './developer.service';
import { UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

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
      },
      webhookDelivery: {
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'del-1', ...args.data })),
      },
    };

    service = new DeveloperService(mockPrisma);
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
});
