import { IsMongoId, IsString, IsNotEmpty } from 'class-validator';

export class JoinQueueDto {
  @IsString()
  @IsNotEmpty()
  patient_id: string; // 9-digit alphanumeric patient ID

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsMongoId()
  @IsNotEmpty()
  hospital_id: string;
}
