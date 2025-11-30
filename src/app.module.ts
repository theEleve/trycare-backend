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
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/trycare'),
    HospitalModule,
    DoctorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb://localhost:27017/diagnosis_reports',
    ),
    DiagnosisReportModule,
    HealthModule,
  ],
})
export class AppModule {}
