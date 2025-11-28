import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @IsOptional()
  @IsString()
  phone: string;


}
