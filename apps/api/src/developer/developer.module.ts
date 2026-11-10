import { Module } from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { V1EnvelopesController } from './v1-envelopes.controller';
import { SettingsDeveloperController } from './settings-developer.controller';
import { EnvelopesModule } from '../envelopes/envelopes.module';

@Module({
  imports: [EnvelopesModule],
  controllers: [V1EnvelopesController, SettingsDeveloperController],
  providers: [DeveloperService],
  exports: [DeveloperService],
})
export class DeveloperModule {}
