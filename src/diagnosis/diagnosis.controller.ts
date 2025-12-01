import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import type {
  SubmitDiagnosisInput,
  DiagnosisResult,
} from './diagnosis.service';

/**
 * Handles patient diagnosis submission and retrieval endpoints
 */
@Controller('diagnosis')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  async submitDiagnosis(
    @Body() input: SubmitDiagnosisInput,
  ): Promise<DiagnosisResult> {
    return await this.diagnosisService.submitDiagnosis(input);
  }

  @Get(':id')
  async getDiagnosis(@Param('id') id: string): Promise<DiagnosisResult | null> {
    return await this.diagnosisService.getDiagnosisById(id);
  }

  @Get('patient/:patientUserId')
  async getPatientHistory(
    @Param('patientUserId') patientUserId: string,
  ): Promise<DiagnosisResult[]> {
    return await this.diagnosisService.getPatientDiagnosisHistory(
      patientUserId,
    );
  }
}
