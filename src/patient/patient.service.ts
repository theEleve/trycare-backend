import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { throwError } from 'rxjs';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { UpdatePatientDto } from './dto/upadate-patience.dto';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';

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

  async finduser(id: string) {
    const results = await this.patientModel.findById(id).select('-password');
    if (!results) throw new NotFoundException('user not found ');
    return results;
  }

  async upadateuser(id: string, updatePatientDto: UpdatePatientDto) {
    const emailExists = await this.patientModel.findOne({
      email: updatePatientDto.email,
    });
    if (emailExists) throw new ConflictException('Email already exists');
    const OurUser = await this.patientModel.findByIdAndUpdate(
      id,
      { $set: { ...updatePatientDto } },
      { new: true },
    );
    if (!OurUser) throw new NotFoundException('user not found ');
    return updatePatientDto;
  }

  async GetAll(id: string) {
    const user = await this.patientModel.findById(id);
    if (!user) throw new NotFoundException('user not found ');
    const role = user.role;
    if (role === 'Patient')
      throw new ForbiddenException('You dont have permission');
    return this.patientModel.find()

  }
}
