import { Module } from '@nestjs/common';
import { EnvelopesService } from './envelopes.service';
import { EnvelopesController } from './envelopes.controller';
import { PdfService } from './pdf.service';

@Module({
  controllers: [EnvelopesController],
  providers: [EnvelopesService, PdfService],
  exports: [EnvelopesService, PdfService],
})
export class EnvelopesModule {}
