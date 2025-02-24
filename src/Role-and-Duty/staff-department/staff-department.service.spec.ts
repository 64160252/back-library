import { Test, TestingModule } from '@nestjs/testing';
import { StaffsDepartmentService } from './staff-department.service';

describe('StaffDepartmentService', () => {
  let service: StaffsDepartmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffsDepartmentService],
    }).compile();

    service = module.get<StaffsDepartmentService>(StaffsDepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
