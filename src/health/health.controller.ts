import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get('db')
  checkDatabase(): { status: string; readyState: number } {
    const state: number = this.connection.readyState as number;

    // MongoDB readyState mapping
    const getStateLabel = (readyState: number): string => {
      switch (readyState) {
        case 0:
          return 'DISCONNECTED';
        case 1:
          return 'CONNECTED';
        case 2:
          return 'CONNECTING';
        case 3:
          return 'DISCONNECTING';
        default:
          return 'UNKNOWN';
      }
    };

    return {
      status: getStateLabel(state),
      readyState: state,
    };
  }
}
