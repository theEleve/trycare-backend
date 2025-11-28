import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Doctor extends Document {
  @Prop()
  name: string;

  @Prop()
  specialization: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' })
  hospitalId: string;

  @Prop()
  doctorId: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
