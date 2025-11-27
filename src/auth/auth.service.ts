import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PatientService } from '../patient/patient.service';
import * as bcrypt from 'bcrypt';
import { PatientDocument } from '../patient/schemas/patient.schema'; // import this

@Injectable()
export class AuthService {
  constructor(
    private patientService: PatientService,
    private jwtService: JwtService,
  ) {}

  async validatePatient(email: string, password: string): Promise<PatientDocument> {
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

  async login(email: string, password: string) {
  const patient = await this.validatePatient(email, password);

  const payload = { sub: patient._id, email: patient.email, role: patient.role };
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

}
