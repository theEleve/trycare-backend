import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { HospitalPatientService } from './hospital-patient.service';
import { JoinHospitalDto } from './dto/join-hospital.dto';
import { JoinQueueDto } from './dto/join-queue.dto';

@Controller('hospital-patient')
export class HospitalPatientController {
  constructor(
    private readonly hospitalPatientService: HospitalPatientService,
  ) {}

  /**
   * POST /hospital-patient/join-hospital
   * Join a hospital - creates patient record with 9-digit alphanumeric ID
   */
  @Post('join-hospital')
  async joinHospital(@Body() joinHospitalDto: JoinHospitalDto) {
    return this.hospitalPatientService.joinHospital(joinHospitalDto);
  }

  /**
   * POST /hospital-patient/join-queue
   * Join queue - adds patient to hospital queue
   */
  @Post('join-queue')
  async joinQueue(@Body() joinQueueDto: JoinQueueDto) {
    return this.hospitalPatientService.joinQueue(joinQueueDto);
  }

  /**
   * GET /hospital-patient/:patient_id
   * Get patient details by patient ID
   */
  @Get(':patient_id')
  async getPatientById(@Param('patient_id') patient_id: string) {
    return this.hospitalPatientService.getByPatientId(patient_id);
  }

  /**
   * GET /hospital-patient/hospital/:hospital_id/patients
   * Get all patients registered at a specific hospital
   */
  @Get('hospital/:hospital_id/patients')
  async getHospitalPatients(@Param('hospital_id') hospital_id: string) {
    return this.hospitalPatientService.getHospitalPatients(hospital_id);
  }

  /**
   * GET /hospital-patient/hospital/:hospital_id/queue
   * Get queue for a specific hospital
   */
  @Get('hospital/:hospital_id/queue')
  async getHospitalQueue(@Param('hospital_id') hospital_id: string) {
    return this.hospitalPatientService.getHospitalQueue(hospital_id);
  }

  /**
   * GET /hospital-patient/queue/position
   * Get patient's position in queue
   */
  @Get('queue/position')
  async getQueuePosition(
    @Query('patient_id') patient_id: string,
    @Query('hospital_id') hospital_id: string,
  ) {
    return this.hospitalPatientService.getPatientQueuePosition(
      patient_id,
      hospital_id,
    );
  }
}
