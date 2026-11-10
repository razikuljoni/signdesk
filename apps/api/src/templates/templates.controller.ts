import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  async listTemplates(@Request() req: any) {
    return this.templatesService.listTemplates(req.user.workspaceId);
  }

  @Get(':id')
  async getTemplate(@Request() req: any, @Param('id') id: string) {
    return this.templatesService.getTemplate(id, req.user.workspaceId);
  }

  @Post()
  async createTemplate(
    @Request() req: any,
    @Body()
    body: {
      name: string;
      pdfUrl: string;
      fieldLayout: any;
      message?: string;
      defaultExpiryDays?: number;
      defaultReminderHours?: number;
    },
  ) {
    return this.templatesService.createTemplate(req.user.workspaceId, body);
  }

  @Post('from-envelope/:envelopeId')
  async createFromEnvelope(
    @Request() req: any,
    @Param('envelopeId') envelopeId: string,
    @Body() body?: { templateName?: string },
  ) {
    return this.templatesService.createFromEnvelope(
      envelopeId,
      req.user.workspaceId,
      body?.templateName,
    );
  }

  @Post(':id/use')
  async useTemplate(
    @Request() req: any,
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      recipients: Array<{
        role: string;
        name: string;
        email: string;
      }>;
    },
  ) {
    return this.templatesService.useTemplate(
      id,
      req.user.workspaceId,
      req.user.userId,
      body,
    );
  }

  @Delete(':id')
  async deleteTemplate(@Request() req: any, @Param('id') id: string) {
    return this.templatesService.deleteTemplate(id, req.user.workspaceId);
  }
}
