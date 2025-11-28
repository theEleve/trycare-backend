import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiagnosisReportController } from './diagnosis-report.controller';
import { DiagnosisReportService } from './diagnosis-report.service';
import { DiagnosisReport, DiagnosisReportSchema } from './schemas/diagnosis-report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DiagnosisReport.name,
        schema: DiagnosisReportSchema,
      },
    ]),
  ],
  controllers: [DiagnosisReportController],
  providers: [DiagnosisReportService],
})
export class DiagnosisReportModule {}
