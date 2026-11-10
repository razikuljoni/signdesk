import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      datasources: {
        db: {
          url:
            process.env.DATABASE_URL ||
            'postgresql://signdesk:signdesk_dev_secret@localhost:5432/signdesk?schema=public',
        },
      },
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma connected to database.');
    } catch (err: any) {
      this.logger.warn(`Could not connect to database on init: ${err.message}`);
      if (process.env.NODE_ENV !== 'test') {
        throw err;
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

