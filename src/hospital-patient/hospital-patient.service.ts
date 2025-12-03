import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  HospitalPatient,
  HospitalPatientDocument,
} from './hospital-patient.schema';
import { PatientQueue, PatientQueueDocument } from './patient-queue.schema';
import { JoinHospitalDto } from './dto/join-hospital.dto';
import { JoinQueueDto } from './dto/join-queue.dto';
import { Hospital } from '../hospital/hospital.schema';

@Injectable()
export class HospitalPatientService {
  constructor(
    @InjectModel(HospitalPatient.name)
    private hospitalPatientModel: Model<HospitalPatientDocument>,
    @InjectModel(Hospital.name)
    private hospitalModel: Model<Hospital>,
    @InjectModel(PatientQueue.name)
    private patientQueueModel: Model<PatientQueueDocument>,
  ) {}

  /**
   * Generate a 9-digit alphanumeric patient ID
   */
  private generatePatientId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let patientId = '';
    for (let i = 0; i < 9; i++) {
      patientId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return patientId;
  }

  /**
   * Join hospital - creates a patient record for the user in a particular hospital
   */
  async joinHospital(
    joinHospitalDto: JoinHospitalDto,
  ): Promise<HospitalPatientDocument> {
    const { hospital_id, phone } = joinHospitalDto;

    // Validate hospital exists
    if (!Types.ObjectId.isValid(hospital_id)) {
      throw new BadRequestException('Invalid hospital ID');
    }

    const hospital = await this.hospitalModel.findById(hospital_id);
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    // Check if patient already registered at this hospital
    const existingPatient = await this.hospitalPatientModel.findOne({
      hospital_id: new Types.ObjectId(hospital_id),
      phone,
    });

    if (existingPatient) {
      throw new ConflictException(
        'Patient already registered at this hospital',
      );
    }

    // Generate unique patient ID
    let patientId = this.generatePatientId();
    let isUnique = false;

    // Ensure the generated ID is unique
    while (!isUnique) {
      const existing = await this.hospitalPatientModel.findOne({
        patient_id: patientId,
      });
      if (!existing) {
        isUnique = true;
      } else {
        patientId = this.generatePatientId();
      }
    }

    // Create hospital patient record
    const hospitalPatient = new this.hospitalPatientModel({
      hospital_id: new Types.ObjectId(hospital_id),
      phone,
      patient_id: patientId,
      registered_at: new Date(),
    });

    return hospitalPatient.save();
  }

  /**
   * Get hospital patient by patient ID
   */
  async getByPatientId(patient_id: string): Promise<HospitalPatientDocument> {
    const hospitalPatient = await this.hospitalPatientModel
      .findOne({ patient_id })
      .populate('hospital_id', 'name address');

    if (!hospitalPatient) {
      throw new NotFoundException('Patient ID not found');
    }

    return hospitalPatient;
  }

  /**
   * Get all patients for a specific hospital
   */
  async getHospitalPatients(hospital_id: string): Promise<HospitalPatientDocument[]> {
    if (!Types.ObjectId.isValid(hospital_id)) {
      throw new BadRequestException('Invalid hospital ID');
    }

    return this.hospitalPatientModel
      .find({ hospital_id: new Types.ObjectId(hospital_id) })
      .sort({ registered_at: -1 })
      .exec();
  }

  /**
   * Join queue - adds patient to the hospital queue
   */
  async joinQueue(joinQueueDto: JoinQueueDto): Promise<PatientQueueDocument> {
    const { patient_id, hospital_id, full_name } = joinQueueDto;

    // Validate hospital exists
    if (!Types.ObjectId.isValid(hospital_id)) {
      throw new BadRequestException('Invalid hospital ID');
    }

    const hospital = await this.hospitalModel.findById(hospital_id);
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    // Find and validate hospital patient
    const hospitalPatient = await this.hospitalPatientModel.findOne({
      patient_id,
      hospital_id: new Types.ObjectId(hospital_id),
    });

    if (!hospitalPatient) {
      throw new NotFoundException(
        'Patient not registered at this hospital. Please join the hospital first.',
      );
    }

    // Update full name if not already set or if different
    if (!hospitalPatient.full_name || hospitalPatient.full_name !== full_name) {
      hospitalPatient.full_name = full_name;
      await hospitalPatient.save();
    }

    // Check if patient is already in queue for this hospital
    const existingQueue = await this.patientQueueModel.findOne({
      patient_id,
      hospital_id: new Types.ObjectId(hospital_id),
      status: 'waiting',
    });

    if (existingQueue) {
      throw new ConflictException('Patient is already in the queue');
    }

    // Get the next queue number for this hospital
    const lastInQueue = await this.patientQueueModel
      .findOne({ hospital_id: new Types.ObjectId(hospital_id) })
      .sort({ queue_number: -1 })
      .exec();

    const queue_number = lastInQueue ? lastInQueue.queue_number + 1 : 1;

    // Create queue entry
    const queueEntry = new this.patientQueueModel({
      hospital_id: new Types.ObjectId(hospital_id),
      patient_id,
      full_name,
      queue_number,
      status: 'waiting',
      joined_at: new Date(),
    });

    return queueEntry.save();
  }

  /**
   * Get queue for a specific hospital
   */
  async getHospitalQueue(hospital_id: string): Promise<PatientQueueDocument[]> {
    if (!Types.ObjectId.isValid(hospital_id)) {
      throw new BadRequestException('Invalid hospital ID');
    }

    return this.patientQueueModel
      .find({
        hospital_id: new Types.ObjectId(hospital_id),
        status: 'waiting',
      })
      .sort({ queue_number: 1 })
      .exec();
  }

  /**
   * Get patient's queue position
   */
  async getPatientQueuePosition(
    patient_id: string,
    hospital_id: string,
  ): Promise<{ position: number | null; queue_number: number | null }> {
    if (!Types.ObjectId.isValid(hospital_id)) {
      throw new BadRequestException('Invalid hospital ID');
    }

    const queueEntry = await this.patientQueueModel.findOne({
      patient_id,
      hospital_id: new Types.ObjectId(hospital_id),
      status: 'waiting',
    });

    if (!queueEntry) {
      return { position: null, queue_number: null };
    }

    const position = await this.patientQueueModel.countDocuments({
      hospital_id: new Types.ObjectId(hospital_id),
      status: 'waiting',
      queue_number: { $lt: queueEntry.queue_number },
    });

    return { position: position + 1, queue_number: queueEntry.queue_number };
  }
}
