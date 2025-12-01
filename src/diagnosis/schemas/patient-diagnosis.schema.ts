import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PatientDiagnosisDocument = PatientDiagnosis & Document;

@Schema({ timestamps: true })
export class PatientDiagnosis {
  @Prop({ type: Types.ObjectId, required: true })
  patient_user_id: Types.ObjectId;

  @Prop({ required: true })
  disease: string;

  @Prop({ type: Object, required: true })
  symptoms: Record<string, string>;

  @Prop({ type: Object, required: true })
  ai_feedback: {
    suggestedDiagnosis: string;
    severityRank: 'Low' | 'Mild' | 'Severe';
    managementTips: string[];
    reasoning: string;
  };

  @Prop({ required: true })
  severity_score: number;

  @Prop({ required: true })
  model_version: string;

  @Prop({ type: Date, default: Date.now })
  submitted_at: Date;
}

export const PatientDiagnosisSchema =
  SchemaFactory.createForClass(PatientDiagnosis);
