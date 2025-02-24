import { Test, TestingModule } from '@nestjs/testing';
import { StaffsFacultyService } from './staff-faculty.service';

describe('StaffFacultyService', () => {
  let service: StaffsFacultyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffsFacultyService],
    }).compile();

    service = module.get<StaffsFacultyService>(StaffsFacultyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
