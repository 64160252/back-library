import { Test, TestingModule } from '@nestjs/testing';
import { StaffLibraryAdmService } from './staff-library-adm.service';

describe('StaffLibraryAdmService', () => {
  let service: StaffLibraryAdmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffLibraryAdmService],
    }).compile();

    service = module.get<StaffLibraryAdmService>(StaffLibraryAdmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
