import { Test, TestingModule } from '@nestjs/testing';
import { StaffsLibraryController } from './staff-library.controller';
import { StaffsLibraryService } from './staff-library.service';

describe('StaffLibraryController', () => {
  let controller: StaffsLibraryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffsLibraryController],
      providers: [StaffsLibraryService],
    }).compile();

    controller = module.get<StaffsLibraryController>(StaffsLibraryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
