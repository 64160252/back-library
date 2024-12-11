import { Test, TestingModule } from '@nestjs/testing';
import { ExecutiveService } from './executive.service';

describe('ExecutiveService', () => {
  let service: ExecutiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExecutiveService],
    }).compile();

    service = module.get<ExecutiveService>(ExecutiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
