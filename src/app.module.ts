import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiagnosisReportModule } from './diagnosis-report/diagnosis-report.module';
import { HealthModule } from './health/health.module';
import * as dotenv from 'dotenv';

(dotenv as any).config();

import { HospitalModule } from './hospital/hospital.module';
import { DoctorModule } from './hospital/doctor/doctor.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trycare',
    ),
    HospitalModule,
    DoctorModule,
    DiagnosisReportModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
