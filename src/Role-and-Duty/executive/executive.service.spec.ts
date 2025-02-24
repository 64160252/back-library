import { Test, TestingModule } from '@nestjs/testing';
import { ExecutivesService } from './executive.service';

describe('ExecutiveService', () => {
  let service: ExecutivesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExecutivesService],
    }).compile();

    service = module.get<ExecutivesService>(ExecutivesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
