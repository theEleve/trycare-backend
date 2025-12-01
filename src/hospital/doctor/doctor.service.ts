import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { Doctor, DoctorDocument } from './doctor.schema';
import * as bcrypt from 'bcrypt';

export interface CreateDoctorDto {
  name: string;
  email: string;
  password: string;
  specialization: string;
  hospitalId: string;
  phone?: string;
  doctorId?: string;
}

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  // CREATE NEW DOCTOR
  async create(data: any) {
    const created = new this.doctorModel(data);
    return created.save();
  }

  // GET SPECIFIC DOCTOR BY hospitalId + doctorId
  async findOneByHospital(hospitalId: string, doctorId: string) {
    return this.doctorModel
      .findOne({ _id: doctorId, hospitalId })
      .populate('hospitalId');
  }

  // GET ALL DOCTORS FOR A GIVEN HOSPITAL
  async findByHospital(hospitalId: string) {
    return this.doctorModel.find({ hospitalId }).populate('hospitalId');
  }

  // UPDATE DOCTOR INFORMATION
  async updateDoctor(
    hospitalId: string,
    doctorId: string,
    data: Partial<Doctor>,
  ) {
    return this.doctorModel.findOneAndUpdate(
      { _id: doctorId, hospitalId },
      data as UpdateQuery<Doctor>,
      { new: true },
    );
  }

  // DELETE A DOCTOR UNDER A SPECIFIC HOSPITAL
  async removeDoctor(hospitalId: string, doctorId: string) {
    return this.doctorModel.findOneAndDelete({
      _id: doctorId,
      hospitalId,
    });
  }

  // REGISTER NEW DOCTOR WITH AUTHENTICATION
  async register(createDoctorDto: CreateDoctorDto): Promise<DoctorDocument> {
    const { email, password } = createDoctorDto;

    // Check for existing email
    const emailExists = await this.doctorModel.findOne({ email });
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create doctor
    const newDoctor = new this.doctorModel({
      ...createDoctorDto,
      password: hashedPassword,
      role: 'Doctor',
    });

    return newDoctor.save();
  }

  // FIND DOCTOR BY EMAIL (for authentication)
  async findByEmail(email: string): Promise<DoctorDocument | null> {
    return this.doctorModel.findOne({ email }).select('+password').exec();
  }

  // FIND DOCTOR BY ID
  async findById(id: string): Promise<DoctorDocument | null> {
    return this.doctorModel.findById(id).exec();
  }
}
