import { Test, TestingModule } from '@nestjs/testing';
import { AdminsController } from './admin.controller';
import { AdminsService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminsController],
      providers: [AdminsService],
    }).compile();

    controller = module.get<AdminsController>(AdminsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
