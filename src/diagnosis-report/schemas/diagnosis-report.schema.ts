import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DiagnosisReportDocument = HydratedDocument<DiagnosisReport>;

@Schema({ timestamps: true })
export class DiagnosisReport {
  @Prop({ required: true })
  patientUserId: string;

  @Prop({ type: Object, required: true })
  symptoms: Record<string, any>;

  @Prop({ type: Number, required: true })
  severity: number;

  @Prop({ type: Object, required: true })
  aiGeneratedDiagnosis: Record<string, any>; // AI generated diagnosis / suggestion

  @Prop({ type: Object, default: null })
  doctorFeedback: Record<string, any> | null;

  @Prop({ default: 'pending' })
  status: string; // pending | reviewed | closed
}

export const DiagnosisReportSchema = SchemaFactory.createForClass(DiagnosisReport);
