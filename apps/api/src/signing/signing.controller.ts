import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { SigningService } from './signing.service';
import { Request } from 'express';

@Controller('sign')
export class SigningController {
  constructor(private readonly signingService: SigningService) {}

  @Get(':token')
  async getSignerSession(@Param('token') token: string) {
    return this.signingService.verifySignerToken(token);
  }

  @Get(':token/summary')
  async getAiSummary(@Param('token') token: string) {
    return this.signingService.getAiSummary(token);
  }

  @Post(':token/sign')
  async submitSignature(
    @Param('token') token: string,
    @Body()
    body: {
      captureMode: 'DRAW' | 'TYPE' | 'UPLOAD';
      pngBase64: string;
      fields: Record<string, any>;
      disclosureVersion: string;
    },
    @Req() req: Request,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString() || '103.205.71.12';
    const userAgent = req.headers['user-agent'] || 'SignDesk Web Client';

    return this.signingService.submitSignature(token, {
      ...body,
      ipAddress: ip,
      userAgent,
    });
  }

  @Post(':token/decline')
  async declineEnvelope(
    @Param('token') token: string,
    @Body()
    body: {
      reasonPreset: string;
      reasonText: string;
    },
  ) {
    return this.signingService.declineEnvelope(
      token,
      body.reasonPreset,
      body.reasonText,
    );
  }
}
