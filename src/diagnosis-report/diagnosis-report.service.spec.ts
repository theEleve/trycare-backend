import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosisReportService } from './diagnosis-report.service';

describe('DiagnosisReportService', () => {
  let service: DiagnosisReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiagnosisReportService],
    }).compile();

    service = module.get<DiagnosisReportService>(DiagnosisReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
