import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name)
    private readonly patientModel: Model<PatientDocument>,
  ) {}

  async register(createPatientDto: CreatePatientDto): Promise<PatientDocument> {
    const { email, password } = createPatientDto;

    // Check for existing email
    const emailExists = await this.patientModel.findOne({ email });
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create patient
    const newPatient = new this.patientModel({
      ...createPatientDto,
      password: hashedPassword,
      role: 'Patient',
    });

    return newPatient.save();
  }

  async findByEmail(email: string): Promise<PatientDocument | null> {
    return this.patientModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<PatientDocument | null> {
    return this.patientModel.findById(id).exec();
  }

  async deleteById(id: string): Promise<{ deleted: boolean }> {
    const result = await this.patientModel.deleteOne({ _id: id }).exec();
    return { deleted: result.deletedCount > 0 };
  }
}
