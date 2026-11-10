import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { EnvelopesModule } from './envelopes/envelopes.module';
import { MailModule } from './mail/mail.module';
import { SigningModule } from './signing/signing.module';
import { TemplatesModule } from './templates/templates.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    WorkspacesModule,
    EnvelopesModule,
    MailModule,
    SigningModule,
    TemplatesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
