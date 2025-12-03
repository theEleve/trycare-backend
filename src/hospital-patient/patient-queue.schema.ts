import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PatientQueueDocument = PatientQueue & Document;

@Schema({ timestamps: true })
export class PatientQueue {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Hospital', index: true })
  hospital_id: Types.ObjectId;

  @Prop({ required: true })
  patient_id: string; // 9-digit alphanumeric ID from HospitalPatient

  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true, type: Number })
  queue_number: number;

  @Prop({ default: 'waiting', enum: ['waiting', 'called', 'completed'] })
  status: string;

  @Prop({ type: Date })
  joined_at?: Date;
}

export const PatientQueueSchema = SchemaFactory.createForClass(PatientQueue);

// Index for efficient querying
PatientQueueSchema.index({ hospital_id: 1, status: 1, queue_number: 1 });
PatientQueueSchema.index({ patient_id: 1, hospital_id: 1 });
