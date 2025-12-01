import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AIService } from '../ai/ai.service';
import {
  PatientDiagnosis,
  PatientDiagnosisDocument,
} from './schemas/patient-diagnosis.schema';

export interface SubmitDiagnosisInput {
  patientUserId: string;
  disease: string;
  symptoms: Record<string, string>;
  additionalNotes?: string;
}

export interface DiagnosisResult {
  id: string;
  patientUserId: string;
  disease: string;
  symptoms: Record<string, string>;
  aiFeedback: {
    suggestedDiagnosis: string;
    severityRank: 'Low' | 'Mild' | 'Severe';
    managementTips: string[];
    reasoning: string;
  };
  severityScore: number;
  modelVersion: string;
  submittedAt: Date;
}

/**
 * Orchestrates patient diagnosis workflow including AI analysis and data persistence
 */
@Injectable()
export class DiagnosisService {
  private readonly logger = new Logger(DiagnosisService.name);

  constructor(
    private readonly aiService: AIService,
    @InjectModel(PatientDiagnosis.name)
    private patientDiagnosisModel: Model<PatientDiagnosisDocument>,
  ) {}

  /**
   * Processes patient symptoms and generates comprehensive diagnosis
   * @param input Patient identification, disease type, and symptom data
   * @returns Complete diagnosis with AI analysis and severity classification
   */
  async submitDiagnosis(input: SubmitDiagnosisInput): Promise<DiagnosisResult> {
    const { patientUserId, disease, symptoms, additionalNotes } = input;

    this.logger.log(
      `Processing diagnosis for patient: ${patientUserId}, disease: ${disease}`,
    );

    const aiResult = await this.aiService.generateDiagnosis({
      disease,
      symptoms,
      additionalNotes,
    });

    // Save to MongoDB PatientDiagnosis collection
    const savedDiagnosis = await this.patientDiagnosisModel.create({
      patient_user_id: new Types.ObjectId(patientUserId),
      disease,
      symptoms,
      ai_feedback: {
        suggestedDiagnosis: aiResult.suggestedDiagnosis,
        severityRank: aiResult.severityRank,
        managementTips: aiResult.managementTips,
        reasoning: aiResult.reasoning,
      },
      severity_score: aiResult.severityScore,
      model_version: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      submitted_at: new Date(),
    });

    this.logger.log(
      `Diagnosis saved for patient: ${patientUserId}, severity: ${aiResult.severityRank} (${aiResult.severityScore})`,
    );

    return {
      id: savedDiagnosis._id.toString(),
      patientUserId,
      disease,
      symptoms,
      aiFeedback: {
        suggestedDiagnosis: aiResult.suggestedDiagnosis,
        severityRank: aiResult.severityRank,
        managementTips: aiResult.managementTips,
        reasoning: aiResult.reasoning,
      },
      severityScore: aiResult.severityScore,
      modelVersion: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      submittedAt: savedDiagnosis.submitted_at,
    };
  }

  /**
   * Retrieves diagnosis record by ID
   */
  async getDiagnosisById(diagnosisId: string): Promise<DiagnosisResult | null> {
    this.logger.log(`Fetching diagnosis: ${diagnosisId}`);

    const diagnosis = await this.patientDiagnosisModel
      .findById(diagnosisId)
      .exec();

    if (!diagnosis) {
      throw new NotFoundException(`Diagnosis with ID ${diagnosisId} not found`);
    }

    return {
      id: diagnosis._id.toString(),
      patientUserId: diagnosis.patient_user_id.toString(),
      disease: diagnosis.disease,
      symptoms: diagnosis.symptoms,
      aiFeedback: diagnosis.ai_feedback,
      severityScore: diagnosis.severity_score,
      modelVersion: diagnosis.model_version,
      submittedAt: diagnosis.submitted_at,
    };
  }

  /**
   * Retrieves complete diagnosis history for a patient
   */
  async getPatientDiagnosisHistory(
    patientUserId: string,
  ): Promise<DiagnosisResult[]> {
    this.logger.log(`Fetching diagnosis history for patient: ${patientUserId}`);

    const diagnoses = await this.patientDiagnosisModel
      .find({ patient_user_id: new Types.ObjectId(patientUserId) })
      .sort({ submitted_at: -1 })
      .exec();

    return diagnoses.map((diagnosis) => ({
      id: diagnosis._id.toString(),
      patientUserId: diagnosis.patient_user_id.toString(),
      disease: diagnosis.disease,
      symptoms: diagnosis.symptoms,
      aiFeedback: diagnosis.ai_feedback,
      severityScore: diagnosis.severity_score,
      modelVersion: diagnosis.model_version,
      submittedAt: diagnosis.submitted_at,
    }));
  }
}
