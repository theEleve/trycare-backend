import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get('db')
  checkDatabase() {
    const state = this.connection.readyState;

    // MongoDB readyState mapping
    const states = {
      0: 'DISCONNECTED',
      1: 'CONNECTED',
      2: 'CONNECTING',
      3: 'DISCONNECTING',
    };

    return {
      status: states[state],
      readyState: state,
    };
  }
}
