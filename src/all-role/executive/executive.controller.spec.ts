import { Test, TestingModule } from '@nestjs/testing';
import { ExecutiveController } from './executive.controller';
import { ExecutiveService } from './executive.service';

describe('ExecutiveController', () => {
  let controller: ExecutiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExecutiveController],
      providers: [ExecutiveService],
    }).compile();

    controller = module.get<ExecutiveController>(ExecutiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
