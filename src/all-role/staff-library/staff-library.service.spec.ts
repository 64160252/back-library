import { Test, TestingModule } from '@nestjs/testing';
import { StaffLibraryService } from './staff-library.service';

describe('StaffLibraryService', () => {
  let service: StaffLibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffLibraryService],
    }).compile();

    service = module.get<StaffLibraryService>(StaffLibraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
