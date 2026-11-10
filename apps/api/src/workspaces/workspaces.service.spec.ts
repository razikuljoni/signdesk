import { WorkspacesService } from './workspaces.service';
import { ForbiddenException, BadRequestException } from '@nestjs/common';

describe('WorkspacesService (Phase 8 - Team Management & RBAC)', () => {
  let service: WorkspacesService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      workspaceMember: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn().mockImplementation((args) => Promise.resolve({ id: 'mem-created', ...args.data })),
        delete: jest.fn().mockResolvedValue({ id: 'mem-deleted' }),
        update: jest.fn().mockResolvedValue({ id: 'mem-updated', role: 'SENDER' }),
      },
      user: {
        findUnique: jest.fn(),
        create: jest.fn().mockResolvedValue({ id: 'user-new', email: 'colleague@apex.bd' }),
      },
      workspace: {
        update: jest.fn().mockResolvedValue({ id: 'ws-1', name: 'Apex Commerce' }),
        delete: jest.fn().mockResolvedValue({ id: 'ws-1' }),
      },
    };

    const mockMail = {
      getQuotaStatus: jest.fn().mockReturnValue({
        sentToday: 22,
        dailyCap: 100,
        remaining: 78,
      }),
    };

    mockPrisma.envelope = {
      count: jest.fn().mockResolvedValue(3),
    };

    service = new WorkspacesService(mockPrisma, mockMail as any);
  });

  it('allows Admin to invite a new team member', async () => {
    mockPrisma.workspaceMember.findUnique
      .mockResolvedValueOnce({ id: 'mem-admin', role: 'ADMIN' }) // admin check
      .mockResolvedValueOnce(null); // existing membership check

    const res = await service.inviteMember('ws-1', 'admin-id', {
      email: 'colleague@apex.bd',
      role: 'SENDER',
      name: 'Farhan Kabir',
    });

    expect(res.role).toBe('SENDER');
    expect(mockPrisma.workspaceMember.create).toHaveBeenCalled();
  });

  it('rejects invite if caller is not an Admin', async () => {
    mockPrisma.workspaceMember.findUnique.mockResolvedValueOnce({
      id: 'mem-sender',
      role: 'SENDER',
    });

    await expect(
      service.inviteMember('ws-1', 'sender-id', {
        email: 'colleague@apex.bd',
        role: 'VIEWER',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('enforces brand color constraint: allows Pine (#0C2E29) or Seal (#B3402A)', async () => {
    mockPrisma.workspaceMember.findUnique.mockResolvedValueOnce({
      id: 'mem-admin',
      role: 'ADMIN',
    });

    const res = await service.updateWorkspace('ws-1', 'admin-id', {
      brandColor: '#0C2E29',
    });
    expect(res.id).toBe('ws-1');

    // Rejects random blue
    mockPrisma.workspaceMember.findUnique.mockResolvedValueOnce({
      id: 'mem-admin',
      role: 'ADMIN',
    });

    await expect(
      service.updateWorkspace('ws-1', 'admin-id', {
        brandColor: '#0000FF',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('prevents Admin from removing themselves', async () => {
    mockPrisma.workspaceMember.findUnique
      .mockResolvedValueOnce({ id: 'mem-admin', userId: 'admin-id', role: 'ADMIN' })
      .mockResolvedValueOnce({ id: 'mem-admin', userId: 'admin-id', workspaceId: 'ws-1' });

    await expect(
      service.removeMember('ws-1', 'admin-id', 'mem-admin'),
    ).rejects.toThrow(BadRequestException);
  });

  it('reports accurate free-tier usage and daily email quota', async () => {
    const usage = await service.getWorkspaceUsage('ws-1');
    expect(usage.plan).toBe('FREE');
    expect(usage.envelopesUsedThisMonth).toBe(3);
    expect(usage.envelopesRemaining).toBe(2);
    expect(usage.resendDailyNotice).toBe('78/100 emails left today');
  });
});
