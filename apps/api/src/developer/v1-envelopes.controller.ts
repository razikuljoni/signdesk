import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  Query,
  Res,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { DeveloperService } from './developer.service';
import { EnvelopesService } from '../envelopes/envelopes.service';

@Controller('v1/envelopes')
export class V1EnvelopesController {
  constructor(
    private readonly developerService: DeveloperService,
    private readonly envelopesService: EnvelopesService,
  ) {}

  private async authenticate(authHeader?: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or malformed Authorization header. Expected Bearer sd_live_...',
        },
      });
    }
    const token = authHeader.replace(/^Bearer /, '').trim();
    return this.developerService.authenticateApiKey(token);
  }

  @Post()
  async createEnvelope(
    @Headers('authorization') authHeader: string,
    @Headers('idempotency-key') idempotencyKey: string,
    @Body()
    body: {
      title: string;
      originalPdfUrl?: string;
      templateId?: string;
      recipients?: Array<{
        name: string;
        email: string;
        role?: 'SIGNER' | 'APPROVER' | 'VIEWER';
        order?: number;
      }>;
    },
  ) {
    const auth = await this.authenticate(authHeader);

    // Idempotency check
    const cached = this.developerService.checkIdempotency(idempotencyKey);
    if (cached) {
      return cached;
    }

    if (!body.title) {
      throw new BadRequestException({
        error: { code: 'INVALID_REQUEST', message: 'Field title is required' },
      });
    }

    const envelope = await this.envelopesService.createDraft(
      'api-caller',
      auth.workspaceId,
      {
        title: body.title,
        originalPdfUrl: body.originalPdfUrl || '/samples/bd-standard-nda.pdf',
        originalHash: 'genesis_api_' + Date.now(),
      },
    );

    if (body.recipients && body.recipients.length > 0) {
      await this.envelopesService.setRecipients(
        envelope.id,
        auth.workspaceId,
        body.recipients.map((r, i) => ({
          name: r.name,
          email: r.email,
          role: r.role || 'SIGNER',
          order: r.order || i + 1,
        })),
      );
    }

    const response = {
      id: envelope.id,
      title: envelope.title,
      status: envelope.status,
      createdAt: envelope.createdAt,
      workspaceId: auth.workspaceId,
    };

    if (idempotencyKey) {
      this.developerService.saveIdempotency(idempotencyKey, response);
    }

    return response;
  }

  @Get()
  async listEnvelopes(
    @Headers('authorization') authHeader: string,
    @Query('status') status?: string,
  ) {
    const auth = await this.authenticate(authHeader);
    return this.envelopesService.listEnvelopes(auth.workspaceId, status);
  }

  @Get(':id')
  async getEnvelope(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
  ) {
    const auth = await this.authenticate(authHeader);
    return this.envelopesService.getEnvelope(id, auth.workspaceId);
  }

  @Post(':id/send')
  async sendEnvelope(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
    @Body() body?: { expiresDays?: number },
  ) {
    const auth = await this.authenticate(authHeader);
    const result = await this.envelopesService.sendEnvelope(
      id,
      auth.workspaceId,
      'api-caller',
      body,
    );

    // Dispatch webhook event
    await this.developerService.dispatchEvent(
      auth.workspaceId,
      id,
      'envelope.sent',
      { envelopeId: id, status: 'WAITING' },
    );

    return result;
  }

  @Post(':id/void')
  async voidEnvelope(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
    @Body() body?: { reason?: string },
  ) {
    const auth = await this.authenticate(authHeader);
    const result = await this.envelopesService.voidEnvelope(
      id,
      auth.workspaceId,
      body?.reason,
    );

    await this.developerService.dispatchEvent(
      auth.workspaceId,
      id,
      'envelope.voided',
      { envelopeId: id, status: 'VOIDED', reason: body?.reason },
    );

    return result;
  }

  @Get(':id/download')
  async downloadFinal(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const auth = await this.authenticate(authHeader);
    const { filename, buffer } = await this.envelopesService.getDocumentBytes(
      id,
      auth.workspaceId,
      'final',
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.end(buffer);
  }

  @Get(':id/audit-trail')
  async getAuditTrail(
    @Headers('authorization') authHeader: string,
    @Param('id') id: string,
  ) {
    const auth = await this.authenticate(authHeader);
    return this.envelopesService.getAuditTrail(id, auth.workspaceId);
  }
}
