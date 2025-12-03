import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HospitalPatientController } from './hospital-patient.controller';
import { HospitalPatientService } from './hospital-patient.service';
import {
  HospitalPatient,
  HospitalPatientSchema,
} from './hospital-patient.schema';
import { PatientQueue, PatientQueueSchema } from './patient-queue.schema';
import { Hospital, HospitalSchema } from '../hospital/hospital.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HospitalPatient.name, schema: HospitalPatientSchema },
      { name: PatientQueue.name, schema: PatientQueueSchema },
      { name: Hospital.name, schema: HospitalSchema },
    ]),
  ],
  controllers: [HospitalPatientController],
  providers: [HospitalPatientService],
  exports: [HospitalPatientService],
})
export class HospitalPatientModule {}
