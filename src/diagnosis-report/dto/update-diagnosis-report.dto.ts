import { IsOptional, IsObject, IsString } from 'class-validator';

export class UpdateDiagnosisFeedbackDto {
  @IsOptional()
  @IsObject()
  doctorFeedback?: Record<string, any>;

  @IsOptional()
  @IsString()
  status?: string; // allow status override if needed
}
