import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiagnosisReportModule } from './diagnosis-report/diagnosis-report.module';
import { HealthModule } from './health/health.module';
import * as dotenv from 'dotenv';

(dotenv as any).config();

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb://localhost:27017/diagnosis_reports',
    ),
    DiagnosisReportModule,
    HealthModule,
  ],
})
export class AppModule {}
