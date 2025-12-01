import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Question,
  QuestionDocument,
  QuestionType,
} from './schemas/question.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name)
    private questionModel: Model<QuestionDocument>,
  ) {}

  async findByDisease(disease: string): Promise<QuestionDocument[]> {
    return this.questionModel
      .find({ disease, is_active: true })
      .sort({ step_number: 1 })
      .exec();
  }

  async findByDiseaseAndStep(
    disease: string,
    step: number,
  ): Promise<QuestionDocument | null> {
    return this.questionModel
      .findOne({ disease, step_number: step, is_active: true })
      .exec();
  }

  async create(questionData: Partial<Question>): Promise<QuestionDocument> {
    const question = new this.questionModel(questionData);
    return question.save();
  }

  async findAll(): Promise<QuestionDocument[]> {
    return this.questionModel
      .find()
      .sort({ disease: 1, step_number: 1 })
      .exec();
  }

  async findById(id: string): Promise<QuestionDocument> {
    const question = await this.questionModel.findById(id).exec();
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async update(
    id: string,
    updateData: Partial<Question>,
  ): Promise<QuestionDocument> {
    const question = await this.questionModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async delete(id: string): Promise<void> {
    const result = await this.questionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
  }

  async seedMalariaQuestions(): Promise<{ message: string; count: number }> {
    const existingQuestions = await this.questionModel
      .find({ disease: 'Malaria' })
      .exec();

    if (existingQuestions.length > 0) {
      return {
        message: 'Malaria questions already exist',
        count: existingQuestions.length,
      };
    }

    const malariaQuestions: Partial<Question>[] = [
      {
        disease: 'Malaria',
        title: 'Do you think you have malaria?',
        type: QuestionType.YES_NO,
        options: ['Yes', 'No'],
        step_number: 1,
        field_name: 'hasMalaria',
        is_required: true,
        is_active: true,
      },
      {
        disease: 'Malaria',
        title:
          "Hi! I'm here to help you check how you're feeling today. Before we begin, what name should I call you?",
        type: QuestionType.TEXT,
        options: [],
        step_number: 2,
        field_name: 'patientName',
        is_required: true,
        is_active: true,
      },
      {
        disease: 'Malaria',
        title: 'How old are you?',
        type: QuestionType.TEXT,
        options: [],
        step_number: 3,
        field_name: 'age',
        is_required: true,
        is_active: true,
      },
      {
        disease: 'Malaria',
        title: 'How are you feeling right now?',
        description: 'Select one or select other and type it',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'Fever',
          'Headache',
          'Body weakness',
          'Chills',
          'Sweating',
          'Nausea',
          'Vomiting',
          'Other',
        ],
        step_number: 4,
        field_name: 'currentFeeling',
        is_required: true,
        is_active: true,
      },
      {
        disease: 'Malaria',
        title: 'When did these symptoms start?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Today', '1-2 days ago', '3-5 days ago', 'More than 5 days'],
        step_number: 5,
        field_name: 'symptomOnset',
        is_required: true,
        is_active: true,
      },
      {
        disease: 'Malaria',
        title:
          'Have you travelled recently to an area with high malaria cases?',
        type: QuestionType.YES_NO,
        options: ['Yes', 'No'],
        step_number: 6,
        field_name: 'travelHistory',
        is_required: true,
        is_active: true,
      },
      {
        disease: 'Malaria',
        title: 'What medications have you taken for these symptoms?',
        description: 'Select all that apply or type others',
        type: QuestionType.MULTIPLE_CHOICE,
        options: [
          'Paracetamol',
          'Antimalarial drugs',
          'Antibiotics',
          'Herbal remedies',
          'None',
          'Other',
        ],
        step_number: 7,
        field_name: 'medicationsTaken',
        is_required: false,
        is_active: true,
      },
    ];

    const created = await this.questionModel.insertMany(malariaQuestions);
    return {
      message: 'Malaria questions seeded successfully',
      count: created.length,
    };
  }
}
