import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HospitalQueueDocument = HospitalQueue & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'hospital_queues',
})
export class HospitalQueue {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Hospital', index: true })
  hospital_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Doctor', index: true })
  doctor_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
  patient_user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'DiagnosisReport' })
  patient_diagnosis_report_id: Types.ObjectId;

  @Prop({ required: true, type: Number })
  queue_order: number;

  @Prop({ required: true, type: Number, min: 1, max: 10, default: 5 })
  priority_level: number;

  @Prop({ type: Date })
  updated_at?: Date;

  @Prop({ type: Date })
  created_at?: Date;
}

export const HospitalQueueSchema = SchemaFactory.createForClass(HospitalQueue);

// Add compound indexes for better query performance
HospitalQueueSchema.index({ doctor_id: 1, priority_level: -1, queue_order: 1 });
HospitalQueueSchema.index({ patient_user_id: 1, doctor_id: 1 });
