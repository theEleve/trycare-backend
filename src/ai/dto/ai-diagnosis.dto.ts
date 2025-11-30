export class AIGenerateDiagnosisInputDto {
  disease: string;
  symptoms: Record<string, string>;
  additionalNotes?: string;
}

export class AIGenerateDiagnosisOutputDto {
  suggestedDiagnosis: string;
  severityRank: 'Low' | 'Mild' | 'Severe';
  managementTips: string[];
  reasoning: string;
  severityScore: number;
}
