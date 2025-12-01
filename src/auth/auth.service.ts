import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PatientService } from '../patient/patient.service';
import { DoctorService } from '../hospital/doctor/doctor.service';
import type { CreateDoctorDto } from '../hospital/doctor/doctor.service';
import * as bcrypt from 'bcrypt';
import { PatientDocument } from '../patient/schemas/patient.schema';
import { DoctorDocument } from '../hospital/doctor/doctor.schema';
import { CreatePatientDto } from '../patient/dto/create-patient.dto';

@Injectable()
export class AuthService {
  constructor(
    private patientService: PatientService,
    private doctorService: DoctorService,
    private jwtService: JwtService,
  ) {}

  async validatePatient(
    email: string,
    password: string,
  ): Promise<PatientDocument> {
    const patient = await this.patientService.findByEmail(email);
    if (!patient) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, patient.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return patient;
  }

  async register(createPatientDto: CreatePatientDto) {
    const patient = await this.patientService.register(createPatientDto);

    const payload = {
      sub: patient._id,
      email: patient.email,
      role: patient.role,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        role: patient.role,
      },
    };
  }

  async login(email: string, password: string) {
    const patient = await this.validatePatient(email, password);

    const payload = {
      sub: patient._id,
      email: patient.email,
      role: patient.role,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        role: patient.role,
      },
    };
  }

  async validateDoctor(
    email: string,
    password: string,
  ): Promise<DoctorDocument> {
    const doctor = await this.doctorService.findByEmail(email);
    if (!doctor) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return doctor;
  }

  async registerDoctor(createDoctorDto: CreateDoctorDto) {
    const doctor = await this.doctorService.register(createDoctorDto);

    const payload = {
      sub: doctor._id,
      email: doctor.email,
      role: doctor.role,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
        specialization: doctor.specialization,
        hospitalId: doctor.hospitalId,
      },
    };
  }

  async loginDoctor(email: string, password: string) {
    const doctor = await this.validateDoctor(email, password);

    const payload = {
      sub: doctor._id,
      email: doctor.email,
      role: doctor.role,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
        specialization: doctor.specialization,
        hospitalId: doctor.hospitalId,
      },
    };
  }
}
