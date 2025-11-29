import {
  Body,
  Controller,
  Post,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
  Get,
  Patch,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/upadate-patience.dto';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
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

  @Get(':id/details')
  async getPatient(@Param('id') id: string) {
    return await this.patientService.finduser(id);
  }

  @Patch(':id/details')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updatePatient(
    @Param('id') id: string,
    @Body() userData: UpdatePatientDto,
  ) {
    return await this.patientService.upadateuser(id, userData);
  }

  @Get('allPatients/:id')
  async GetAllP(@Param('id') id: string) {
    return await this.patientService.GetAll(id);
  }
}
