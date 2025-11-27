import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  async register(createPatientDto: CreatePatientDto): Promise<PatientDocument> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createPatientDto.password, salt);

    const newPatient = new this.patientModel({
      ...createPatientDto,
      password: hashedPassword,
      role: 'Patient',
    });

    return newPatient.save();
  }

  async findByEmail(email: string): Promise<PatientDocument | null> {
    return this.patientModel.findOne({ email });
  }

  async findById(id: string): Promise<PatientDocument | null> {
    return this.patientModel.findById(id);
  }

  async deleteById(id: string): Promise<{ deleted: boolean }> {
    const result = await this.patientModel.deleteOne({ _id: id });
    return { deleted: result.deletedCount > 0 };
  }
}
