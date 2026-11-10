import { TemplatesService } from './templates.service';

describe('TemplatesService (Phase 6 - Reusable Document Templates)', () => {
  let service: TemplatesService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      template: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'tpl-1', name: 'Mutual NDA Template', useCount: 3 },
        ]),
        findFirst: jest.fn().mockResolvedValue({
          id: 'tpl-1',
          name: 'Mutual NDA Template',
          pdfUrl: '/samples/bd-standard-nda.pdf',
          fieldLayout: {
            roles: ['Disclosing Party', 'Receiving Party'],
            fields: [
              {
                role: 'Disclosing Party',
                type: 'SIGNATURE',
                page: 0,
                xRatio: 0.1,
                yRatio: 0.8,
                wRatio: 0.25,
                hRatio: 0.06,
                required: true,
              },
              {
                role: 'Receiving Party',
                type: 'SIGNATURE',
                page: 0,
                xRatio: 0.5,
                yRatio: 0.8,
                wRatio: 0.25,
                hRatio: 0.06,
                required: true,
              },
            ],
          },
        }),
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'tpl-created', ...args.data })),
        update: jest.fn().mockResolvedValue({ id: 'tpl-1', useCount: 4 }),
      },
      envelope: {
        findFirst: jest.fn().mockResolvedValue({
          id: 'env-source',
          title: 'NDA Source',
          originalPdfUrl: '/samples/bd-standard-nda.pdf',
          recipients: [
            { id: 'rec-1', name: 'Tanvir Ahmed', role: 'SIGNER', order: 1 },
            { id: 'rec-2', name: 'Rahim Chowdhury', role: 'SIGNER', order: 2 },
          ],
          fields: [
            {
              id: 'f-1',
              recipientId: 'rec-1',
              type: 'SIGNATURE',
              page: 0,
              xRatio: 0.1,
              yRatio: 0.8,
              wRatio: 0.2,
              hRatio: 0.05,
              required: true,
            },
          ],
        }),
      },
      $transaction: jest.fn(async (cb) => {
        return cb({
          envelope: {
            create: jest.fn().mockResolvedValue({ id: 'env-new', title: 'New From Template' }),
          },
          recipient: {
            create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'rec-' + args.data.order, ...args.data })),
          },
          field: {
            create: jest.fn().mockResolvedValue({ id: 'f-created' }),
          },
          template: {
            update: jest.fn().mockResolvedValue({ id: 'tpl-1' }),
          },
          auditEvent: {
            create: jest.fn().mockResolvedValue({ id: 'evt-1' }),
          },
        });
      }),
    };

    service = new TemplatesService(mockPrisma);
  });

  it('lists workspace templates ordered by usage and creation date', async () => {
    const list = await service.listTemplates('ws-1');
    expect(list.length).toBe(1);
    expect(mockPrisma.template.findMany).toHaveBeenCalledWith({
      where: { workspaceId: 'ws-1' },
      orderBy: [{ useCount: 'desc' }, { createdAt: 'desc' }],
    });
  });

  it('creates a template from an existing envelope', async () => {
    const tpl = await service.createFromEnvelope('env-source', 'ws-1', 'Custom NDA Template');
    expect(mockPrisma.envelope.findFirst).toHaveBeenCalledWith({
      where: { id: 'env-source', workspaceId: 'ws-1' },
      include: expect.any(Object),
    });
    expect(tpl.name).toBe('Custom NDA Template');
  });

  it('uses template to generate an envelope without touching canvas', async () => {
    const res = await service.useTemplate('tpl-1', 'ws-1', 'user-1', {
      title: 'Horizon Logistics NDA',
      recipients: [
        { role: 'Disclosing Party', name: 'Tanvir Ahmed', email: 'tanvir@apex.bd' },
        { role: 'Receiving Party', name: 'Rahim Chowdhury', email: 'rahim@horizon.bd' },
      ],
    });

    expect(res.id).toBe('env-new');
    expect(mockPrisma.$transaction).toHaveBeenCalled();
  });
});
