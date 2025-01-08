import { Test, TestingModule } from '@nestjs/testing';
import { StaffLibraryController } from './staff-library.controller';
import { StaffLibraryService } from './staff-library.service';

describe('StaffLibraryController', () => {
  let controller: StaffLibraryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffLibraryController],
      providers: [StaffLibraryService],
    }).compile();

    controller = module.get<StaffLibraryController>(StaffLibraryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
