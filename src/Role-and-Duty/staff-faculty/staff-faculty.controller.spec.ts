import { Test, TestingModule } from '@nestjs/testing';
import { StaffsFacultyController } from './staff-faculty.controller';
import { StaffsFacultyService } from './staff-faculty.service';

describe('StaffFacultyController', () => {
  let controller: StaffsFacultyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffsFacultyController],
      providers: [StaffsFacultyService],
    }).compile();

    controller = module.get<StaffsFacultyController>(StaffsFacultyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
