import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

export enum QuestionType {
  YES_NO = 'yes_no',
  TEXT = 'text',
  MULTIPLE_CHOICE = 'multiple_choice',
}

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true })
  disease: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: QuestionType })
  type: QuestionType;

  @Prop({ type: [String], default: [] })
  options: string[];

  @Prop({ required: true })
  step_number: number;

  @Prop({ required: true })
  field_name: string; // e.g., 'hasMalaria', 'patientName', 'age'

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ default: false })
  is_required: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
