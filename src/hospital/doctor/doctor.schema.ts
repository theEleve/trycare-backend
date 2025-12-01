import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  specialization: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' })
  hospitalId: string;

  @Prop()
  doctorId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: 'Doctor' })
  role: string;

  @Prop()
  phone?: string;

  @Prop({ default: true })
  is_active: boolean;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
