import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WorkspaceRole } from '@signdesk/shared';

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkspace(workspaceId: string, userId: string) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId },
      },
      include: {
        workspace: {
          include: {
            members: {
              include: { user: { select: { id: true, name: true, email: true } } },
            },
          },
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Workspace not found or access denied');
    }

    return {
      ...member.workspace,
      currentUserRole: member.role,
    };
  }

  async updateWorkspace(
    workspaceId: string,
    userId: string,
    data: {
      name?: string;
      logoUrl?: string;
      brandColor?: string;
      defaultExpiryDays?: number;
      defaultReminderHours?: number;
    },
  ) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId },
      },
    });

    if (!member || member.role !== 'ADMIN') {
      throw new ForbiddenException('Only workspace admins can update settings');
    }

    // Constraint: Brand color restricted to Pine or Seal per §15
    if (data.brandColor) {
      const allowed = ['#0c2e29', '#b3402a', 'pine', 'seal'];
      if (!allowed.includes(data.brandColor.toLowerCase())) {
        throw new BadRequestException('Brand color in MVP is strictly constrained to Pine (#0C2E29) or Seal (#B3402A)');
      }
    }

    return this.prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        ...(data.name ? { name: data.name.trim() } : {}),
        ...(data.logoUrl !== undefined ? { logoUrl: data.logoUrl } : {}),
        ...(data.defaultExpiryDays ? { defaultExpiryDays: data.defaultExpiryDays } : {}),
        ...(data.defaultReminderHours ? { defaultReminderHours: data.defaultReminderHours } : {}),
      },
    });
  }

  async listMembers(workspaceId: string, userId: string) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId },
      },
    });

    if (!member) {
      throw new NotFoundException('Workspace not found');
    }

    return this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { invitedAt: 'asc' },
    });
  }

  async inviteMember(
    workspaceId: string,
    adminUserId: string,
    data: { email: string; role: 'ADMIN' | 'SENDER' | 'VIEWER'; name?: string },
  ) {
    const admin = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: adminUserId } },
    });

    if (!admin || admin.role !== 'ADMIN') {
      throw new ForbiddenException('Only workspace admins can invite new members');
    }

    const email = data.email.toLowerCase().trim();

    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: data.name?.trim() || email.split('@')[0],
        },
      });
    }

    const existingMember = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: user.id } },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of this workspace');
    }

    return this.prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: user.id,
        role: data.role as any,
        acceptedAt: new Date(),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async removeMember(workspaceId: string, adminUserId: string, memberId: string) {
    const admin = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: adminUserId } },
    });

    if (!admin || admin.role !== 'ADMIN') {
      throw new ForbiddenException('Only workspace admins can remove members');
    }

    const targetMember = await this.prisma.workspaceMember.findUnique({
      where: { id: memberId },
    });

    if (!targetMember || targetMember.workspaceId !== workspaceId) {
      throw new NotFoundException('Member not found');
    }

    if (targetMember.userId === adminUserId) {
      throw new BadRequestException('Admins cannot remove themselves from the workspace');
    }

    return this.prisma.workspaceMember.delete({
      where: { id: memberId },
    });
  }

  async updateMemberRole(
    workspaceId: string,
    adminUserId: string,
    memberId: string,
    newRole: 'ADMIN' | 'SENDER' | 'VIEWER',
  ) {
    const admin = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: adminUserId } },
    });

    if (!admin || admin.role !== 'ADMIN') {
      throw new ForbiddenException('Only workspace admins can update roles');
    }

    return this.prisma.workspaceMember.update({
      where: { id: memberId },
      data: { role: newRole as any },
    });
  }

  async deleteWorkspace(workspaceId: string, adminUserId: string) {
    const admin = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: adminUserId } },
    });

    if (!admin || admin.role !== 'ADMIN') {
      throw new ForbiddenException('Only workspace admins can delete this workspace');
    }

    return this.prisma.workspace.delete({
      where: { id: workspaceId },
    });
  }
}
