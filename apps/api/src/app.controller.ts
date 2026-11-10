import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'SignDesk API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  @Get()
  getRoot() {
    return {
      name: 'SignDesk API',
      description: 'e-signature & approval workflow API for Bangladeshi commerce',
      version: '1.0.0',
      docs: '/api/docs',
    };
  }
}
