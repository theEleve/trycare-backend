import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiagnosisService } from './diagnosis.service';
import { DiagnosisController } from './diagnosis.controller';
import { AIModule } from '../ai/ai.module';
import {
  PatientDiagnosis,
  PatientDiagnosisSchema,
} from './schemas/patient-diagnosis.schema';

@Module({
  imports: [
    AIModule,
    MongooseModule.forFeature([
      { name: PatientDiagnosis.name, schema: PatientDiagnosisSchema },
    ]),
  ],
  controllers: [DiagnosisController],
  providers: [DiagnosisService],
  exports: [DiagnosisService],
})
export class DiagnosisModule {}
