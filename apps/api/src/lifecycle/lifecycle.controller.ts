import {
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LifecycleService } from './lifecycle.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('lifecycle')
export class LifecycleController {
  constructor(private readonly lifecycleService: LifecycleService) {}

  @Post('envelopes/:id/remind/:recipientId')
  async sendManualReminder(
    @Request() req: any,
    @Param('id') envelopeId: string,
    @Param('recipientId') recipientId: string,
  ) {
    return this.lifecycleService.sendManualReminder(
      envelopeId,
      recipientId,
      req.user.workspaceId,
    );
  }

  @Post('sweep')
  async sweepExpired() {
    return this.lifecycleService.sweepExpiredEnvelopes();
  }
}
