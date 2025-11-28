import { IsNotEmpty, IsObject, IsNumber, IsString } from 'class-validator';

export class CreateDiagnosisReportDto {
  @IsString()
  @IsNotEmpty()
  patientUserId: string;

  @IsObject()
  symptoms: Record<string, any>;

  @IsNumber()
  severity: number;

  @IsObject()
  aiGeneratedDiagnosis: Record<string, any>;
}
