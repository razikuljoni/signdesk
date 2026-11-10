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
import { DeveloperService } from './developer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsDeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @Get('api-keys')
  async listKeys(@Request() req: any) {
    return this.developerService.listApiKeys(req.user.workspaceId);
  }

  @Post('api-keys')
  async createKey(
    @Request() req: any,
    @Body() body: { name: string; scopes?: string[]; isTest?: boolean },
  ) {
    return this.developerService.createApiKey(req.user.workspaceId, body);
  }

  @Delete('api-keys/:id')
  async revokeKey(@Request() req: any, @Param('id') id: string) {
    return this.developerService.revokeApiKey(req.user.workspaceId, id);
  }

  @Get('webhooks')
  async listWebhooks(@Request() req: any) {
    return this.developerService.listWebhookEndpoints(req.user.workspaceId);
  }

  @Post('webhooks')
  async createWebhook(
    @Request() req: any,
    @Body() body: { url: string; events: string[] },
  ) {
    return this.developerService.createWebhookEndpoint(req.user.workspaceId, body);
  }

  @Delete('webhooks/:id')
  async deleteWebhook(@Request() req: any, @Param('id') id: string) {
    return this.developerService.deleteWebhookEndpoint(req.user.workspaceId, id);
  }

  @Post('webhooks/:id/test')
  async testWebhook(
    @Request() req: any,
    @Param('id') id: string,
  ) {
    return this.developerService.dispatchEvent(
      req.user.workspaceId,
      'test-envelope-id',
      'envelope.completed',
      {
        test: true,
        message: 'This is a test webhook payload from SignDesk.',
        timestamp: new Date().toISOString(),
      },
    );
  }
}
