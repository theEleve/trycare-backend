// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreatePatientDto } from '../patient/dto/create-patient.dto';
import type { CreateDoctorDto } from '../hospital/doctor/doctor.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Patient authentication
  @Post('register')
  async register(@Body() createPatientDto: CreatePatientDto) {
    return this.authService.register(createPatientDto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // Doctor authentication
  @Post('doctor/register')
  async registerDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    return this.authService.registerDoctor(createDoctorDto);
  }

  @Post('doctor/login')
  async loginDoctor(@Body() body: { email: string; password: string }) {
    return this.authService.loginDoctor(body.email, body.password);
  }
}
