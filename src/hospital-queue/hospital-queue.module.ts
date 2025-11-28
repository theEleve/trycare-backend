import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HospitalQueue, HospitalQueueSchema } from './hospital-queue.schema';
import { HospitalQueueService } from './hospital-queue.service';
import { HospitalQueueController } from './hospital-queue.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HospitalQueue.name, schema: HospitalQueueSchema },
    ]),
  ],
  controllers: [HospitalQueueController],
  providers: [HospitalQueueService],
  exports: [HospitalQueueService],
})
export class HospitalQueueModule {}
