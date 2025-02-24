import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from './store.controller';
import { StoresService } from './store.service';

describe('StoreController', () => {
  let controller: StoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoresController],
      providers: [StoresService],
    }).compile();

    controller = module.get<StoresController>(StoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
