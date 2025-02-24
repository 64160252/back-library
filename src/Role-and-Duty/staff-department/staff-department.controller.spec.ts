import { Test, TestingModule } from '@nestjs/testing';
import { StaffsDepartmentController } from './staff-department.controller';
import { StaffsDepartmentService } from './staff-department.service';

describe('StaffDepartmentController', () => {
  let controller: StaffsDepartmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffsDepartmentController],
      providers: [StaffsDepartmentService],
    }).compile();

    controller = module.get<StaffsDepartmentController>(
      StaffsDepartmentController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
