import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { DiagnosisReportService } from './diagnosis-report.service';
import { CreateDiagnosisReportDto } from './dto/create-diagnosis-report.dto';
import { UpdateDiagnosisFeedbackDto } from './dto/update-diagnosis-report.dto';

@Controller('diagnosis-report')
export class DiagnosisReportController {
  constructor(private readonly service: DiagnosisReportService) {}

  @Post()
  create(@Body() dto: CreateDiagnosisReportDto) {
    return this.service.createReport(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.getReportById(id);
  }

  @Get('patient/:patientUserId')
  findByPatient(@Param('patientUserId') patientUserId: string) {
    return this.service.getReportsByPatient(patientUserId);
  }

  @Patch('feedback/:id')
  updateFeedback(
    @Param('id') id: string,
    @Body() dto: UpdateDiagnosisFeedbackDto,
  ) {
    return this.service.updateDoctorFeedback(id, dto);
  }
}
