import { IsMongoId, IsString, IsNotEmpty } from 'class-validator';

export class JoinHospitalDto {
  @IsMongoId()
  @IsNotEmpty()
  hospital_id: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
