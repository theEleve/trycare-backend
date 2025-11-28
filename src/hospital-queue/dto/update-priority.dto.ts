import { IsNumber, Min, Max } from 'class-validator';

export class UpdatePriorityDto {
  @IsNumber()
  @Min(1)
  @Max(10)
  priority_level: number;
}