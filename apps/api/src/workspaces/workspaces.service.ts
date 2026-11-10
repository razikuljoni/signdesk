import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

    return member.workspace;
  }

  async updateWorkspace(
    workspaceId: string,
    userId: string,
    data: {
      name?: string;
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

    return this.prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        ...(data.name ? { name: data.name.trim() } : {}),
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
    });
  }
}
