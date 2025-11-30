import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HospitalQueue, HospitalQueueDocument } from './hospital-queue.schema';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdatePriorityDto } from './dto/update-priority.dto';

@Injectable()
export class HospitalQueueService {
  private readonly logger = new Logger(HospitalQueueService.name);

  constructor(
    @InjectModel(HospitalQueue.name)
    private queueModel: Model<HospitalQueueDocument>,
  ) {}

  /**
   * Add a patient to the queue
   */
  async addToQueue(
    createQueueDto: CreateQueueDto,
  ): Promise<HospitalQueueDocument> {
    try {
      // Check if patient is already in queue for this doctor
      const existingQueue = await this.queueModel.findOne({
        patient_user_id: new Types.ObjectId(createQueueDto.patient_user_id),
        doctor_id: new Types.ObjectId(createQueueDto.doctor_id),
      });

      if (existingQueue) {
        throw new BadRequestException(
          'Patient is already in queue for this doctor',
        );
      }

      // Get the current max queue order for this doctor
      const lastInQueue = await this.queueModel
        .findOne({ doctor_id: new Types.ObjectId(createQueueDto.doctor_id) })
        .sort({ queue_order: -1 })
        .exec();

      const queue_order = lastInQueue ? lastInQueue.queue_order + 1 : 1;

      const queueEntry = new this.queueModel({
        hospital_id: new Types.ObjectId(createQueueDto.hospital_id),
        doctor_id: new Types.ObjectId(createQueueDto.doctor_id),
        patient_user_id: new Types.ObjectId(createQueueDto.patient_user_id),
        patient_diagnosis_report_id: new Types.ObjectId(
          createQueueDto.patient_diagnosis_report_id,
        ),
        queue_order,
        priority_level: createQueueDto.priority_level,
      });

      const saved = await queueEntry.save();
      this.logger.log(
        `Patient ${createQueueDto.patient_user_id} added to queue at position ${queue_order}`,
      );

      return saved;
    } catch (error) {
      this.logger.error(`Error adding to queue: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get queue for a specific doctor (sorted by priority and order)
   */
  async getDoctorQueue(doctor_id: string): Promise<HospitalQueueDocument[]> {
    try {
      if (!Types.ObjectId.isValid(doctor_id)) {
        throw new BadRequestException('Invalid doctor ID');
      }

      const queue = await this.queueModel
        .find({ doctor_id: new Types.ObjectId(doctor_id) })
        .sort({ priority_level: -1, queue_order: 1 })
        .populate('patient_user_id', 'name email phone')
        .populate('patient_diagnosis_report_id')
        .exec();

      return queue;
    } catch (error) {
      this.logger.error(`Error fetching doctor queue: ${error.message}`);

      const queue = await this.queueModel
        .find({ doctor_id: new Types.ObjectId(doctor_id) })
        .sort({ priority_level: -1, queue_order: 1 })
        .lean()
        .exec();

      return queue as any;
    }
  }

  /**
   * Get all queues for a hospital
   */
  async getHospitalQueue(
    hospital_id: string,
  ): Promise<HospitalQueueDocument[]> {
    try {
      if (!Types.ObjectId.isValid(hospital_id)) {
        throw new BadRequestException('Invalid hospital ID');
      }

      const queue = await this.queueModel
        .find({ hospital_id: new Types.ObjectId(hospital_id) })
        .sort({ priority_level: -1, queue_order: 1 })
        .populate('doctor_id', 'name specialization email')
        .populate('patient_user_id', 'name email phone')
        .lean()
        .exec();

      return queue as any;
    } catch (error) {
      this.logger.warn(
        'Could not populate related data. Some schemas may not be registered yet.',
      );

      const queue = await this.queueModel
        .find({ hospital_id: new Types.ObjectId(hospital_id) })
        .sort({ priority_level: -1, queue_order: 1 })
        .lean()
        .exec();

      return queue as any;
    }
  }

  /**
   * Remove patient from queue (after consultation)
   */
  async removeFromQueue(queue_id: string): Promise<{ message: string }> {
    try {
      if (!Types.ObjectId.isValid(queue_id)) {
        throw new BadRequestException('Invalid queue ID');
      }

      const deleted = await this.queueModel.findByIdAndDelete(queue_id).exec();

      if (!deleted) {
        throw new NotFoundException('Queue entry not found');
      }

      this.logger.log(`Queue entry ${queue_id} removed`);
      return { message: 'Patient removed from queue successfully' };
    } catch (error) {
      this.logger.error(`Error removing from queue: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get patient's position in queue
   */
  async getPatientPosition(patient_user_id: string, doctor_id: string) {
    try {
      if (
        !Types.ObjectId.isValid(patient_user_id) ||
        !Types.ObjectId.isValid(doctor_id)
      ) {
        throw new BadRequestException('Invalid patient or doctor ID');
      }

      const queue = await this.getDoctorQueue(doctor_id);

      const position = queue.findIndex(
        (item) => item.patient_user_id._id.toString() === patient_user_id,
      );

      return {
        position: position !== -1 ? position + 1 : null,
        total_in_queue: queue.length,
        estimated_wait_time:
          position !== -1 ? this.calculateWaitTime(position + 1) : null,
      };
    } catch (error) {
      this.logger.error(`Error getting patient position: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update priority level for a queue entry
   */
  async updatePriority(
    queue_id: string,
    updatePriorityDto: UpdatePriorityDto,
  ): Promise<HospitalQueueDocument> {
    try {
      if (!Types.ObjectId.isValid(queue_id)) {
        throw new BadRequestException('Invalid queue ID');
      }

      const updated = await this.queueModel
        .findByIdAndUpdate(
          queue_id,
          { priority_level: updatePriorityDto.priority_level },
          { new: true },
        )
        .exec();

      if (!updated) {
        throw new NotFoundException('Queue entry not found');
      }

      this.logger.log(
        `Queue ${queue_id} priority updated to ${updatePriorityDto.priority_level}`,
      );
      return updated;
    } catch (error) {
      this.logger.error(`Error updating priority: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get a single queue entry by ID
   */
  async getQueueById(queue_id: string) {
    try {
      if (!Types.ObjectId.isValid(queue_id)) {
        throw new BadRequestException('Invalid queue ID');
      }

      // Try with populate
      try {
        const queue = await this.queueModel
          .findById(queue_id)
          .populate('patient_user_id', 'name email phone')
          .populate('doctor_id', 'name specialization')
          .populate('patient_diagnosis_report_id', 'diagnosis severity_score')
          .lean()
          .exec();

        if (!queue) {
          throw new NotFoundException('Queue entry not found');
        }

        return queue;
      } catch (populateError) {
        // Fallback without populate
        const queue = await this.queueModel.findById(queue_id).lean().exec();

        if (!queue) {
          throw new NotFoundException('Queue entry not found');
        }

        return queue;
      }
    } catch (error) {
      this.logger.error(`Error fetching queue by ID: ${error.message}`);
      throw error;
    }
  }

  private calculateWaitTime(position: number): string {
    const avgConsultationTime = 15;
    const waitMinutes = position * avgConsultationTime;

    if (waitMinutes < 60) {
      return `${waitMinutes} minutes`;
    } else {
      const hours = Math.floor(waitMinutes / 60);
      const minutes = waitMinutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} minutes` : ''}`;
    }
  }

  async clearQueue(
    doctor_id: string,
  ): Promise<{ message: string; deleted_count: number }> {
    try {
      if (!Types.ObjectId.isValid(doctor_id)) {
        throw new BadRequestException('Invalid doctor ID');
      }

      const result = await this.queueModel
        .deleteMany({ doctor_id: new Types.ObjectId(doctor_id) })
        .exec();

      this.logger.log(
        `Cleared ${result.deletedCount} entries from doctor ${doctor_id}'s queue`,
      );

      return {
        message: 'Queue cleared successfully',
        deleted_count: result.deletedCount,
      };
    } catch (error) {
      this.logger.error(`Error clearing queue: ${error.message}`);
      throw error;
    }
  }
}
