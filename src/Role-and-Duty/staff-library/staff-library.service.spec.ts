import { Test, TestingModule } from '@nestjs/testing';
import { StaffsLibraryService } from './staff-library.service';

describe('StaffLibraryService', () => {
  let service: StaffsLibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffsLibraryService],
    }).compile();

    service = module.get<StaffsLibraryService>(StaffsLibraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
