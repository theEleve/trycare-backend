import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DiagnosisReport,
  DiagnosisReportDocument,
} from './schemas/diagnosis-report.schema';
import { CreateDiagnosisReportDto } from './dto/create-diagnosis-report.dto';
import { UpdateDiagnosisFeedbackDto } from './dto/update-diagnosis-report.dto';

@Injectable()
export class DiagnosisReportService {
  constructor(
    @InjectModel(DiagnosisReport.name)
    private readonly reportModel: Model<DiagnosisReportDocument>,
  ) {}

  async createReport(dto: CreateDiagnosisReportDto) {
    const created = new this.reportModel({
      ...dto,
      status: 'pending',
    });
    return created.save();
  }

  async getReportById(id: string) {
    const rep = await this.reportModel.findById(id).exec();
    if (!rep) throw new NotFoundException('Report not found');
    return rep;
  }

  async getReportsByPatient(patientUserId: string) {
    return this.reportModel
      .find({ patientUserId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateDoctorFeedback(id: string, dto: UpdateDiagnosisFeedbackDto) {
    const updated = await this.reportModel
      .findByIdAndUpdate(
        id,
        {
          doctorFeedback: dto.doctorFeedback ?? null,
          status: dto.status ?? 'reviewed',
        },
        { new: true },
      )
      .exec();

    if (!updated) throw new NotFoundException('Report not found');
    return updated;
  }
}
