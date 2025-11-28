import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HospitalModule } from './hospital/hospital.module';
import { DoctorModule } from './hospital/doctor/doctor.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/trycare'),
    HospitalModule,
    DoctorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
