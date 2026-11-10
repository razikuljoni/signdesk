import { LifecycleService } from './lifecycle.service';
import { BadRequestException } from '@nestjs/common';

describe('LifecycleService (Phase 7 - Automated Lifecycle & Expiry Sweeper)', () => {
  let service: LifecycleService;
  let mockPrisma: any;
  let mockMail: any;

  beforeEach(() => {
    mockMail = {
      sendSigningReminder: jest.fn().mockResolvedValue({ success: true }),
    };
    mockPrisma = {
      envelope: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn().mockResolvedValue({ id: 'env-1', status: 'EXPIRED' }),
      },
      recipient: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      auditEvent: {
        create: jest.fn().mockResolvedValue({ id: 'evt-1' }),
      },
      $transaction: jest.fn(async (cb) => {
        return cb(mockPrisma);
      }),
    };

    service = new LifecycleService(mockPrisma, mockMail);
  });

  it('state re-check: does NOT send reminder if recipient already signed', async () => {
    mockPrisma.envelope.findUnique.mockResolvedValueOnce({
      id: 'env-1',
      status: 'WAITING',
      originalHash: 'hash-orig',
      recipients: [
        { id: 'rec-1', email: 'rahim@horizon.bd', status: 'SIGNED' },
      ],
      auditEvents: [{ eventHash: 'hash-1' }],
    });

    const result = await service.executeLifecycleJob({
      type: 'reminder',
      envelopeId: 'env-1',
      recipientId: 'rec-1',
      scheduledFor: new Date().toISOString(),
    });

    expect(result.executed).toBe(false);
    expect(result.reason).toContain('skipping reminder');
    expect(mockMail.sendSigningReminder).not.toHaveBeenCalled();
  });

  it('state re-check: does NOT execute if envelope was voided or completed', async () => {
    mockPrisma.envelope.findUnique.mockResolvedValueOnce({
      id: 'env-1',
      status: 'COMPLETED',
      originalHash: 'hash-orig',
      recipients: [],
      auditEvents: [],
    });

    const result = await service.executeLifecycleJob({
      type: 'reminder',
      envelopeId: 'env-1',
      recipientId: 'rec-1',
      scheduledFor: new Date().toISOString(),
    });

    expect(result.executed).toBe(false);
    expect(result.reason).toContain('skipping reminder');
  });

  it('sweeper: catches expired envelopes and transitions to EXPIRED with chained audit event', async () => {
    mockPrisma.envelope.findMany.mockResolvedValueOnce([
      {
        id: 'env-expired',
        status: 'WAITING',
        originalHash: 'genesis-hash',
        auditEvents: [{ eventHash: 'prev-event-hash' }],
        recipients: [],
      },
    ]);

    const result = await service.sweepExpiredEnvelopes();

    expect(result.sweptCount).toBe(1);
    expect(mockPrisma.envelope.update).toHaveBeenCalledWith({
      where: { id: 'env-expired' },
      data: { status: 'EXPIRED' },
    });
    expect(mockPrisma.auditEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        envelopeId: 'env-expired',
        action: 'expired',
        prevHash: 'prev-event-hash',
      }),
    });
  });

  it('enforces 24-hour rate limit on manual reminders', async () => {
    const recentDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
    mockPrisma.envelope.findFirst.mockResolvedValueOnce({
      id: 'env-1',
      status: 'WAITING',
      recipients: [{ id: 'rec-1', email: 'test@bd.com', status: 'NOTIFIED' }],
      auditEvents: [
        { action: 'reminded', timestampUtc: recentDate.toISOString() },
      ],
    });

    await expect(
      service.sendManualReminder('env-1', 'rec-1', 'ws-1'),
    ).rejects.toThrow(BadRequestException);
  });
});
