import { EnvelopesService } from './envelopes.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('EnvelopesService', () => {
  let service: EnvelopesService;
  let mockPrisma: any;
  let mockMail: any;
  let mockPdf: any;

  beforeEach(() => {
    mockMail = {
      sendSigningInvitation: jest.fn().mockResolvedValue({ success: true }),
    };
    mockPdf = {
      generateSampleContractPdf: jest.fn().mockResolvedValue(Buffer.from('%PDF-1.4 sample')),
      flattenAndFinalize: jest.fn().mockResolvedValue({
        finalPdfBytes: Buffer.from('%PDF-1.4 final'),
        finalHash: 'hash-final-12345',
        cocBytes: Buffer.from('%PDF-1.4 coc'),
      }),
      verifyAuditChain: jest.fn().mockReturnValue({ valid: true }),
    };
    mockPrisma = {
      $transaction: jest.fn(async (cb) => {
        return cb({
          envelope: {
            count: jest.fn().mockResolvedValue(0),
            create: jest.fn().mockResolvedValue({
              id: 'env-1',
              title: 'Mutual NDA',
              originalHash: 'genesis_hash_123',
            }),
            update: jest.fn().mockResolvedValue({
              id: 'env-1',
              status: 'DRAFT',
              version: 2,
            }),
          },
          recipient: {
            updateMany: jest.fn().mockResolvedValue({ count: 1 }),
          },
          auditEvent: {
            create: jest.fn().mockResolvedValue({ id: 'evt-1' }),
          },
        });
      }),
      envelope: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'env-1', title: 'Mutual NDA', status: 'DRAFT' },
        ]),
        findFirst: jest.fn().mockResolvedValue({
          id: 'env-1',
          title: 'Mutual NDA',
          status: 'DRAFT',
          originalHash: 'genesis_hash_123',
          version: 1,
          fields: [],
          recipients: [],
          auditEvents: [{ eventHash: 'genesis_hash_123' }],
        }),
      },
    };

    service = new EnvelopesService(mockPrisma, mockMail, mockPdf);
  });

  it('creates a draft with genesis audit event', async () => {
    const res = await service.createDraft('user-1', 'ws-1', {
      title: 'Mutual NDA',
      originalPdfUrl: '/samples/bd-standard-nda.pdf',
      originalHash: 'genesis_hash_123',
    });

    expect(res.id).toBe('env-1');
    expect(mockPrisma.$transaction).toHaveBeenCalled();
  });

  it('lists workspace envelopes excluding soft-deleted ones', async () => {
    const res = await service.listEnvelopes('ws-1', 'all');
    expect(res.length).toBe(1);
    expect(mockPrisma.envelope.findMany).toHaveBeenCalledWith({
      where: {
        workspaceId: 'ws-1',
        deletedAt: null,
      },
      include: expect.any(Object),
      orderBy: { createdAt: 'desc' },
    });
  });

  it('enforces immutability: rejects modifying a completed envelope', async () => {
    mockPrisma.envelope.findFirst.mockResolvedValueOnce({
      id: 'env-1',
      status: 'COMPLETED',
      fields: [],
      recipients: [],
      auditEvents: [],
    });

    await expect(
      service.updateDraft('env-1', 'ws-1', { title: 'New Title' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('enforces RBAC: Viewer cannot send an envelope (403 Forbidden)', async () => {
    mockPrisma.workspaceMember = {
      findUnique: jest.fn().mockResolvedValue({ role: 'VIEWER' }),
    };

    await expect(
      service.sendEnvelope('env-1', 'ws-1', 'viewer-user'),
    ).rejects.toThrow(ForbiddenException);
  });

  it('enforces free tier monthly cap: blocks the 6th envelope in a month with clear message', async () => {
    mockPrisma.$transaction = jest.fn(async (cb) => {
      return cb({
        envelope: {
          count: jest.fn().mockResolvedValue(5), // 5 already used
        },
      });
    });

    await expect(
      service.createDraft('user-1', 'ws-1', {
        title: '6th Envelope Attempt',
        originalPdfUrl: '/samples/doc.pdf',
        originalHash: 'hash-6th',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('enforces RBAC: Viewer cannot void an envelope (403 Forbidden)', async () => {
    mockPrisma.workspaceMember = {
      findUnique: jest.fn().mockResolvedValue({ role: 'VIEWER' }),
    };

    await expect(
      service.voidEnvelope('env-1', 'ws-1', 'reason', 'viewer-user'),
    ).rejects.toThrow(ForbiddenException);
  });
});
