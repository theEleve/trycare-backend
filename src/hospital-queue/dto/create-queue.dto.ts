import { IsNumber, Min, Max, IsMongoId } from 'class-validator';

export class CreateQueueDto {
  @IsMongoId()
  hospital_id: string;

  @IsMongoId()
  doctor_id: string;

  @IsMongoId()
  patient_user_id: string;

  @IsMongoId()
  patient_diagnosis_report_id: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  priority_level: number;
}
