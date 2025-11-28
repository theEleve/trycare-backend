import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosisReportController } from './diagnosis-report.controller';

describe('DiagnosisReportController', () => {
  let controller: DiagnosisReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiagnosisReportController],
    }).compile();

    // Removed unnecessary type assertion
    controller = module.get(DiagnosisReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
