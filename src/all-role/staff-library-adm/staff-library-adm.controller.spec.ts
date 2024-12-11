import { Test, TestingModule } from '@nestjs/testing';
import { StaffLibraryAdmController } from './staff-library-adm.controller';
import { StaffLibraryAdmService } from './staff-library-adm.service';

describe('StaffLibraryAdmController', () => {
  let controller: StaffLibraryAdmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffLibraryAdmController],
      providers: [StaffLibraryAdmService],
    }).compile();

    controller = module.get<StaffLibraryAdmController>(StaffLibraryAdmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
