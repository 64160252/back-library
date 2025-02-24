import { Test, TestingModule } from '@nestjs/testing';
import { ExecutivesController } from './executive.controller';
import { ExecutivesService } from './executive.service';

describe('ExecutiveController', () => {
  let controller: ExecutivesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExecutivesController],
      providers: [ExecutivesService],
    }).compile();

    controller = module.get<ExecutivesController>(ExecutivesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
