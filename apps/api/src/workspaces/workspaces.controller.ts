import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get('current')
  async getCurrent(@Request() req: any) {
    return this.workspacesService.getWorkspace(req.user.workspaceId, req.user.userId);
  }

  @Patch('current')
  async updateCurrent(
    @Request() req: any,
    @Body()
    body: {
      name?: string;
      logoUrl?: string;
      brandColor?: string;
      defaultExpiryDays?: number;
      defaultReminderHours?: number;
    },
  ) {
    return this.workspacesService.updateWorkspace(
      req.user.workspaceId,
      req.user.userId,
      body,
    );
  }

  @Get('current/members')
  async getMembers(@Request() req: any) {
    return this.workspacesService.listMembers(req.user.workspaceId, req.user.userId);
  }

  @Post('current/members')
  async inviteMember(
    @Request() req: any,
    @Body()
    body: {
      email: string;
      role: 'ADMIN' | 'SENDER' | 'VIEWER';
      name?: string;
    },
  ) {
    return this.workspacesService.inviteMember(
      req.user.workspaceId,
      req.user.userId,
      body,
    );
  }

  @Patch('current/members/:id')
  async updateMemberRole(
    @Request() req: any,
    @Param('id') memberId: string,
    @Body() body: { role: 'ADMIN' | 'SENDER' | 'VIEWER' },
  ) {
    return this.workspacesService.updateMemberRole(
      req.user.workspaceId,
      req.user.userId,
      memberId,
      body.role,
    );
  }

  @Delete('current/members/:id')
  async removeMember(@Request() req: any, @Param('id') memberId: string) {
    return this.workspacesService.removeMember(
      req.user.workspaceId,
      req.user.userId,
      memberId,
    );
  }

  @Delete('current')
  async deleteWorkspace(@Request() req: any) {
    return this.workspacesService.deleteWorkspace(
      req.user.workspaceId,
      req.user.userId,
    );
  }
}
