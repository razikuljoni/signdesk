import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { EnvelopesModule } from './envelopes/envelopes.module';

@Module({
  imports: [PrismaModule, AuthModule, WorkspacesModule, EnvelopesModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}


