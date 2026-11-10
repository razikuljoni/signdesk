import { EnvelopesService } from './envelopes.service';

describe('EnvelopesService', () => {
  let service: EnvelopesService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      $transaction: jest.fn(async (cb) => {
        return cb({
          envelope: {
            create: jest.fn().mockResolvedValue({
              id: 'env-1',
              title: 'Mutual NDA',
              originalHash: 'genesis_hash_123',
            }),
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
      },
    };

    service = new EnvelopesService(mockPrisma);
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
});
