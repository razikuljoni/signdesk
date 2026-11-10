import {
  Controller,
  Get,
  Patch,
  Body,
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
}
