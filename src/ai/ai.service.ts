import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';

export interface AIGenerateDiagnosisInput {
  disease: string;
  symptoms: Record<string, string>;
  additionalNotes?: string;
}

export interface AIGenerateDiagnosisOutput {
  suggestedDiagnosis: string;
  severityRank: 'Low' | 'Mild' | 'Severe';
  managementTips: string[];
  reasoning: string;
  severityScore: number;
}

interface GeminiAPIResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
  };
}

interface ParsedAIResponse {
  suggestedDiagnosis?: string;
  severityRank?: string;
  managementTips?: string[];
  reasoning?: string;
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private readonly apiKey: string;
  private readonly model: string;
  private readonly apiUrl: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;

    if (!this.apiKey) {
      this.logger.warn('⚠️ GEMINI_API_KEY not found in environment variables');
    }
    this.logger.log(`Using Gemini model: ${this.model}`);
  }

  /**
   * Generates AI-powered diagnosis based on patient symptoms
   * @param input Disease type, symptom data, and optional context
   * @returns Structured diagnosis with severity classification and management recommendations
   */
  async generateDiagnosis(
    input: AIGenerateDiagnosisInput,
  ): Promise<AIGenerateDiagnosisOutput> {
    const { disease, symptoms, additionalNotes } = input;

    this.logger.log(`Generating diagnosis for disease: ${disease}`);

    if (!this.apiKey) {
      throw new HttpException(
        'AI service is not configured. Missing GEMINI_API_KEY',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const systemPrompt = this.getDiseaseSystemPrompt(disease);
    const userPrompt = this.formatUserPrompt(
      disease,
      symptoms,
      additionalNotes,
    );
    const aiResponse = await this.callGeminiAPI(systemPrompt, userPrompt);
    const parsedResponse = this.parseAIResponse(aiResponse);
    const severityScore = this.calculateSeverityScore(
      parsedResponse.severityRank,
    );

    return {
      ...parsedResponse,
      severityScore,
    };
  }

  /**
   * Retrieves disease-specific system prompt with severity classification criteria
   */
  private getDiseaseSystemPrompt(disease: string): string {
    const prompts: Record<string, string> = {
      Malaria: `You are a medical AI assistant specializing in Malaria symptom evaluation.

SEVERITY CLASSIFICATION CRITERIA (Follow these rules strictly):

**Low Severity** - Use when:
- No fever OR very mild fever (< 38°C)
- Minimal or no other symptoms
- No travel to malaria-endemic areas
- Symptoms could be from other minor illnesses
- Patient is generally well

**Mild Severity** - Use when:
- Fever present (38-39°C) for 1-3 days
- Some additional symptoms (headache, body weakness, chills)
- Travel to malaria-endemic area OR exposure risk
- Symptoms suggest possible malaria but not life-threatening
- Patient can function but needs medical evaluation

**Severe Severity** - Use when:
- High fever (>39°C) for 3+ days
- Multiple severe symptoms (severe weakness, persistent vomiting, confusion)
- Signs of complications (difficulty breathing, jaundice, severe anemia)
- Patient unable to eat/drink or perform daily activities
- Immediate medical intervention required

ANALYSIS PROCESS:
1. Count the number and severity of symptoms present
2. Evaluate fever presence and duration (most important indicator)
3. Check for travel history to endemic areas
4. Assess overall symptom severity and patient functionality
5. Apply the criteria above consistently

STRICT OUTPUT REQUIREMENTS:
You MUST respond with ONLY a valid JSON object. No markdown, no explanations outside JSON.

{
  "suggestedDiagnosis": "string",
  "severityRank": "Low | Mild | Severe",
  "managementTips": [
    "string"
  ],
  "reasoning": "string"
}

IMPORTANT RULES:
- Be CONSISTENT: Same symptoms = Same severity rank every time
- If only fever is mentioned with no duration/severity → Default to "Mild"
- If fever + travel history → "Mild" minimum
- If fever + multiple symptoms → "Mild" or "Severe" based on intensity
- Never provide definitive diagnosis, always recommend professional evaluation
- Do NOT add markdown code blocks, commentary, or text outside the JSON object`,
      // Additional diseases can be added here
    };

    const prompt = prompts[disease];
    if (!prompt) {
      throw new HttpException(
        `Disease "${disease}" is not currently supported. Available: ${Object.keys(prompts).join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return prompt;
  }

  /**
   * Formats patient symptom data into structured prompt for AI analysis
   */
  private formatUserPrompt(
    disease: string,
    symptoms: Record<string, string>,
    additionalNotes?: string,
  ): string {
    let prompt = `The following are patient's answers to your ${disease} screening questions.
Analyze and complete the required JSON response:

${JSON.stringify(symptoms, null, 2)}`;

    if (additionalNotes) {
      prompt += `\n\nAdditional Context:\n${additionalNotes}`;
    }

    return prompt;
  }

  /**
   * Executes API call to Gemini with optimized configuration for medical diagnosis
   */
  private async callGeminiAPI(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<string> {
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\n---\n\n${userPrompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no code blocks, no explanations. Just the raw JSON object.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.0,
        topK: 1,
        topP: 0.1,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    };

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as GeminiAPIResponse;
        this.logger.error(`Gemini API error: ${JSON.stringify(errorData)}`);
        throw new HttpException(
          `AI service error: ${errorData.error?.message || 'Unknown error'}`,
          HttpStatus.BAD_GATEWAY,
        );
      }

      const data = (await response.json()) as GeminiAPIResponse;

      // Log the full response for debugging
      this.logger.debug(`Full Gemini API response: ${JSON.stringify(data)}`);

      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiResponse) {
        this.logger.error(
          `Empty AI response. Full data: ${JSON.stringify(data, null, 2)}`,
        );
        this.logger.error(
          `Response structure: candidates=${!!data.candidates}, ` +
            `candidates[0]=${!!data.candidates?.[0]}, ` +
            `content=${!!data.candidates?.[0]?.content}, ` +
            `parts=${!!data.candidates?.[0]?.content?.parts}`,
        );
        throw new HttpException(
          'AI service returned empty response. Check server logs for details.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.debug(`Raw AI response: ${aiResponse}`);
      return aiResponse;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      const err = error as Error;
      this.logger.error(`Failed to call Gemini API: ${err.message}`);
      throw new HttpException(
        `Failed to analyze symptoms: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Parses and validates AI response with fallback handling for malformed output
   */
  private parseAIResponse(
    aiResponse: string,
  ): Omit<AIGenerateDiagnosisOutput, 'severityScore'> {
    try {
      let cleanedResponse = aiResponse.trim();

      if (cleanedResponse.includes('```')) {
        cleanedResponse = cleanedResponse
          .replace(/```json\n?/gi, '')
          .replace(/```\n?/g, '')
          .trim();
      }

      const jsonStart = cleanedResponse.indexOf('{');
      if (jsonStart > 0) {
        cleanedResponse = cleanedResponse.substring(jsonStart);
      }

      const jsonEnd = cleanedResponse.lastIndexOf('}');
      if (jsonEnd > 0 && jsonEnd < cleanedResponse.length - 1) {
        cleanedResponse = cleanedResponse.substring(0, jsonEnd + 1);
      }

      this.logger.debug(`Cleaned response: ${cleanedResponse}`);

      let parsed: ParsedAIResponse;
      try {
        parsed = JSON.parse(cleanedResponse) as ParsedAIResponse;
      } catch (parseError) {
        const error = parseError as Error;
        this.logger.error(`JSON parse error: ${error.message}`);
        this.logger.error(`Attempted to parse: ${cleanedResponse}`);
        return this.getFallbackResponse();
      }
      const suggestedDiagnosis =
        parsed.suggestedDiagnosis ||
        'Unable to determine diagnosis from symptoms provided';
      const severityRank = this.validateSeverityRank(parsed.severityRank);
      const managementTips = Array.isArray(parsed.managementTips)
        ? parsed.managementTips
        : ['Consult a healthcare professional for proper evaluation'];
      const reasoning =
        parsed.reasoning ||
        'AI analysis was inconclusive. Medical consultation recommended.';

      return {
        suggestedDiagnosis,
        severityRank,
        managementTips,
        reasoning,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Unexpected error in parseAIResponse: ${err.message}`);
      this.logger.error(`Original response: ${aiResponse}`);

      return this.getFallbackResponse();
    }
  }

  /**
   * Validates severity rank and provides safe default if invalid
   */
  private validateSeverityRank(
    rank: string | undefined,
  ): 'Low' | 'Mild' | 'Severe' {
    const validRanks = ['Low', 'Mild', 'Severe'] as const;
    if (rank && validRanks.includes(rank as 'Low' | 'Mild' | 'Severe')) {
      return rank as 'Low' | 'Mild' | 'Severe';
    }
    this.logger.warn(
      `Invalid severity rank: ${rank ?? 'undefined'}, defaulting to Mild`,
    );
    return 'Mild';
  }

  /**
   * Returns safe fallback response when AI output cannot be parsed
   */
  private getFallbackResponse(): Omit<
    AIGenerateDiagnosisOutput,
    'severityScore'
  > {
    this.logger.warn('Returning fallback response due to parsing failure');
    return {
      suggestedDiagnosis:
        'Unable to generate AI diagnosis. Please consult a healthcare professional.',
      severityRank: 'Mild',
      managementTips: [
        'Seek immediate medical attention for proper evaluation',
        'Do not self-diagnose or self-medicate',
        'Provide complete symptom information to your doctor',
      ],
      reasoning:
        'AI analysis could not be completed. Professional medical evaluation is strongly recommended.',
    };
  }

  /**
   * Converts severity rank to numeric score for queue prioritization
   */
  private calculateSeverityScore(
    severityRank: 'Low' | 'Mild' | 'Severe',
  ): number {
    const scoreMap = {
      Low: 20,
      Mild: 60,
      Severe: 90,
    };
    return scoreMap[severityRank];
  }
}
