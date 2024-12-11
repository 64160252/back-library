import { Test, TestingModule } from '@nestjs/testing';
import { StaffFacultyController } from './staff-faculty.controller';
import { StaffFacultyService } from './staff-faculty.service';

describe('StaffFacultyController', () => {
  let controller: StaffFacultyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffFacultyController],
      providers: [StaffFacultyService],
    }).compile();

    controller = module.get<StaffFacultyController>(StaffFacultyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
