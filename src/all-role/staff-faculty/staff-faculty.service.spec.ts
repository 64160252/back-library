import { Test, TestingModule } from '@nestjs/testing';
import { StaffFacultyService } from './staff-faculty.service';

describe('StaffFacultyService', () => {
  let service: StaffFacultyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffFacultyService],
    }).compile();

    service = module.get<StaffFacultyService>(StaffFacultyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
