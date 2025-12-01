import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  async getQuestions(@Query('disease') disease?: string) {
    if (disease) {
      return this.questionsService.findByDisease(disease);
    }
    return this.questionsService.findAll();
  }

  @Get(':disease/step/:step')
  async getQuestionByStep(
    @Param('disease') disease: string,
    @Param('step') step: string,
  ) {
    const stepNumber = parseInt(step, 10);
    return this.questionsService.findByDiseaseAndStep(disease, stepNumber);
  }

  @Post('seed/malaria')
  @HttpCode(HttpStatus.OK)
  async seedMalariaQuestions() {
    return this.questionsService.seedMalariaQuestions();
  }
}
