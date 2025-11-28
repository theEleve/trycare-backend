import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { Doctor } from './doctor.schema';

@Injectable()
export class DoctorService {
  constructor(@InjectModel(Doctor.name) private doctorModel: Model<Doctor>) {}

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
}
