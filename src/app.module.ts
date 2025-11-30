import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientModule } from './patient/patient.module';
import { AuthModule } from './auth/auth.module';
import { DiagnosisReportModule } from './diagnosis-report/diagnosis-report.module';
import { HealthModule } from './health/health.module';
import { HospitalModule } from './hospital/hospital.module';
import { DoctorModule } from './hospital/doctor/doctor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    PatientModule,
    AuthModule,
    HospitalModule,
    DoctorModule,
    DiagnosisReportModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
