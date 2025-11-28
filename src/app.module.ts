import { Module } from '@nestjs/common';
import { HospitalQueueModule } from './hospital-queue/hospital-queue.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://adetumo:unbarfable@cluster0.hhdm3.mongodb.net/hospitaldb',
    ),
    HospitalQueueModule,
  ],
})
export class AppModule {}
