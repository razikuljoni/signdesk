import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EnvelopesService } from './envelopes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FieldType } from '@signdesk/shared';

@UseGuards(JwtAuthGuard)
@Controller('envelopes')
export class EnvelopesController {
  constructor(private readonly envelopesService: EnvelopesService) {}

  @Post()
  async createDraft(
    @Request() req: any,
    @Body()
    body: {
      title: string;
      originalPdfUrl: string;
      originalHash: string;
      messageToSigners?: string;
      expiresAt?: string;
    },
  ) {
    return this.envelopesService.createDraft(req.user.userId, req.user.workspaceId, {
      ...body,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    });
  }

  @Get()
  async listEnvelopes(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.envelopesService.listEnvelopes(req.user.workspaceId, status, search);
  }

  @Get(':id')
  async getEnvelope(@Request() req: any, @Param('id') id: string) {
    return this.envelopesService.getEnvelope(id, req.user.workspaceId);
  }

  @Patch(':id')
  async updateDraft(
    @Request() req: any,
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      messageToSigners?: string;
      expiresAt?: string;
    },
  ) {
    return this.envelopesService.updateDraft(id, req.user.workspaceId, {
      ...body,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    });
  }

  @Post(':id/recipients')
  async setRecipients(
    @Request() req: any,
    @Param('id') id: string,
    @Body()
    body: {
      recipients: Array<{
        name: string;
        email: string;
        role: 'SIGNER' | 'APPROVER' | 'VIEWER';
        order: number;
      }>;
    },
  ) {
    return this.envelopesService.setRecipients(id, req.user.workspaceId, body.recipients);
  }

  @Post(':id/fields')
  async setFields(
    @Request() req: any,
    @Param('id') id: string,
    @Body()
    body: {
      fields: Array<{
        recipientId?: string | null;
        type: FieldType;
        page: number;
        xRatio: number;
        yRatio: number;
        wRatio: number;
        hRatio: number;
        required: boolean;
        label?: string;
        placeholder?: string;
        options?: any;
      }>;
    },
  ) {
    return this.envelopesService.setFields(id, req.user.workspaceId, body.fields);
  }

  @Post(':id/duplicate')
  async duplicateDraft(@Request() req: any, @Param('id') id: string) {
    return this.envelopesService.duplicateDraft(id, req.user.workspaceId, req.user.userId);
  }

  @Delete(':id')
  async softDelete(@Request() req: any, @Param('id') id: string) {
    return this.envelopesService.softDelete(id, req.user.workspaceId);
  }
}
