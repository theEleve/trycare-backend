import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true })
export class Patient {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: 'Patient' })
  role: string;

  @Prop()
  age?: number;

  @Prop({ enum: ['Male', 'Female', 'Other'] })
  gender?: string;

  @Prop({ unique: true, sparse: true })
  patient_code?: string;

  @Prop({ type: [String], default: [] })
  medical_history?: string[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
