import { Body, Controller, Post } from '@nestjs/common';
import { PatientService } from './patient.service';
import { Param, Delete } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('register')
  async register(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.register(createPatientDto);
  }

  @Delete(':id')
  async deletePatient(@Param('id') id: string) {
    const result = await this.patientService.deleteById(id);
    if (!result.deleted) {
      return { message: 'Patient not found' };
    }
    return { message: 'Patient account deleted successfully' };
  }
}
