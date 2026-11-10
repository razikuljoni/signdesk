import { SigningService } from './signing.service';

describe('SigningService', () => {
  let service: SigningService;
  let mockPrisma: any;
  let mockMail: any;

  beforeEach(() => {
    mockMail = {
      sendSigningInvitation: jest.fn().mockResolvedValue({ success: true }),
    };
    mockPrisma = {
      recipient: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'rec-1',
          name: 'Rahim Chowdhury',
          email: 'rahim@horizon.bd',
          status: 'NOTIFIED',
          envelopeId: 'env-1',
          envelope: {
            id: 'env-1',
            title: 'Commercial Agreement',
            status: 'WAITING',
            owner: { name: 'Tanvir Ahmed', email: 'tanvir@apex.bd' },
            recipients: [{ id: 'rec-1', name: 'Rahim', role: 'SIGNER', order: 1, status: 'NOTIFIED' }],
            fields: [],
            auditEvents: [{ id: 'evt-1', eventHash: 'hash-1' }],
          },
        }),
        update: jest.fn().mockResolvedValue({ id: 'rec-1' }),
      },
      auditEvent: {
        create: jest.fn().mockResolvedValue({ id: 'evt-2' }),
      },
    };

    service = new SigningService(mockPrisma, mockMail);
  });

  it('hashes raw tokens with sha256', () => {
    const raw = 'test_secret_token_123';
    const hash = service.hashToken(raw);
    expect(hash).toHaveLength(64);
    expect(hash).toBe(service.hashToken(raw)); // Deterministic
  });

  it('returns active status for valid recipient token', async () => {
    const session = await service.verifySignerToken('valid_raw_token');
    expect(session.status).toBe('active');
    expect(session.recipientName).toBe('Rahim Chowdhury');
    expect(session.envelopeTitle).toBe('Commercial Agreement');
  });
});
