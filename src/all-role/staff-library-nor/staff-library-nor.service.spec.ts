import { Test, TestingModule } from '@nestjs/testing';
import { StaffLibraryNorService } from './staff-library-nor.service';

describe('StaffLibraryNorService', () => {
  let service: StaffLibraryNorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffLibraryNorService],
    }).compile();

    service = module.get<StaffLibraryNorService>(StaffLibraryNorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
