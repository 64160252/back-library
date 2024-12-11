import { Test, TestingModule } from '@nestjs/testing';
import { StaffLibraryNorController } from './staff-library-nor.controller';
import { StaffLibraryNorService } from './staff-library-nor.service';

describe('StaffLibraryNorController', () => {
  let controller: StaffLibraryNorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffLibraryNorController],
      providers: [StaffLibraryNorService],
    }).compile();

    controller = module.get<StaffLibraryNorController>(StaffLibraryNorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
