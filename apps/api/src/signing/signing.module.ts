import { Module } from '@nestjs/common';
import { SigningService } from './signing.service';
import { SigningController } from './signing.controller';

@Module({
  controllers: [SigningController],
  providers: [SigningService],
  exports: [SigningService],
})
export class SigningModule {}
