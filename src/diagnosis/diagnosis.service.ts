import { Injectable, Logger } from '@nestjs/common';
import { AIService } from '../ai/ai.service';

export interface SubmitDiagnosisInput {
  patientUserId: string;
  disease: string;
  symptoms: Record<string, string>;
  additionalNotes?: string;
}

export interface DiagnosisResult {
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

  constructor(private readonly aiService: AIService) {}

  /**
   * Processes patient symptoms and generates comprehensive diagnosis
   * @param input Patient identification, disease type, and symptom data
   * @returns Complete diagnosis with AI analysis and severity classification
   */
  async submitDiagnosis(input: SubmitDiagnosisInput): Promise<DiagnosisResult> {
    const { patientUserId, disease, symptoms, additionalNotes } = input;

    this.logger.log(`Processing diagnosis for patient: ${patientUserId}, disease: ${disease}`);

    const aiResult = await this.aiService.generateDiagnosis({
      disease,
      symptoms,
      additionalNotes,
    });
    const diagnosisResult: DiagnosisResult = {
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
      submittedAt: new Date(),
    };

    // TODO: Save to MongoDB PatientDiagnosis collection
    // const savedDiagnosis = await this.patientDiagnosisModel.create(diagnosisResult);

    this.logger.log(
      `Diagnosis completed for patient: ${patientUserId}, severity: ${aiResult.severityRank} (${aiResult.severityScore})`,
    );

    return diagnosisResult;
  }

  /**
   * Retrieves diagnosis record by ID
   */
  async getDiagnosisById(diagnosisId: string): Promise<DiagnosisResult | null> {
    this.logger.log(`Fetching diagnosis: ${diagnosisId}`);
    // TODO: return await this.patientDiagnosisModel.findById(diagnosisId);
    return null;
  }

  /**
   * Retrieves complete diagnosis history for a patient
   */
  async getPatientDiagnosisHistory(patientUserId: string): Promise<DiagnosisResult[]> {
    this.logger.log(`Fetching diagnosis history for patient: ${patientUserId}`);
    // TODO: return await this.patientDiagnosisModel.find({ patientUserId }).sort({ submittedAt: -1 });
    return [];
  }
}
