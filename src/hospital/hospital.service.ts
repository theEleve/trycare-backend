import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hospital } from './hospital.schema';

@Injectable()
export class HospitalService {
  constructor(
    @InjectModel(Hospital.name) private hospitalModel: Model<Hospital>,
  ) {}

  // Create a new hospital
  async createHospital(data: {
    name: string;
    address: string;
    regNo: string;
  }): Promise<Hospital> {
    const hospital = new this.hospitalModel(data);
    return hospital.save();
  }

  // List all hospitals
  async getAllHospitals(): Promise<Hospital[]> {
    return this.hospitalModel.find().exec();
  }

  // Get a hospital by ID
  async getHospitalById(id: string): Promise<Hospital | null> {
    return this.hospitalModel.findById(id).exec();
  }

  // Update a hospital by ID
  async updateHospital(
    id: string,
    data: Partial<Hospital>,
  ): Promise<Hospital | null> {
    return this.hospitalModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  // Delete a hospital by ID
  async removeHospital(id: string): Promise<Hospital | null> {
    return this.hospitalModel.findByIdAndDelete(id).exec();
  }

  //   async getDoctorsByHospital(hospitalId: string) {
  //   // Assuming Doctor module exists and Doctor schema has hospitalId
  //   return this.doctorModel.find({ hospitalId }).exec();
  // }
}
