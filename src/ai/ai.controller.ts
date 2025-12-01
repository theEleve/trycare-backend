import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AIService } from './ai.service';
import type {
  AIGenerateDiagnosisInput,
  AIGenerateDiagnosisOutput,
} from './ai.service';

/**
 * Provides direct access to AI diagnosis functionality for testing and development
 */
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('diagnose')
  @HttpCode(HttpStatus.OK)
  async diagnose(
    @Body() input: AIGenerateDiagnosisInput,
  ): Promise<AIGenerateDiagnosisOutput> {
    return await this.aiService.generateDiagnosis(input);
  }
}
