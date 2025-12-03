import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HospitalPatientDocument = HospitalPatient & Document;

@Schema({ timestamps: true })
export class HospitalPatient {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Hospital', index: true })
  hospital_id: Types.ObjectId;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, unique: true })
  patient_id: string; // 9-digit alphanumeric ID

  @Prop()
  full_name?: string;

  @Prop({ type: Date })
  registered_at?: Date;
}

export const HospitalPatientSchema =
  SchemaFactory.createForClass(HospitalPatient);

// Compound index to ensure unique patient per hospital
HospitalPatientSchema.index({ hospital_id: 1, phone: 1 }, { unique: true });
