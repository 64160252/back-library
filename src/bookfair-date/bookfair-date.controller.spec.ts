import { Test, TestingModule } from '@nestjs/testing';
import { BookfairDateController } from './bookfair-date.controller';
import { BookfairDateService } from './bookfair-date.service';

describe('BookfairDateController', () => {
  let controller: BookfairDateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookfairDateController],
      providers: [BookfairDateService],
    }).compile();

    controller = module.get<BookfairDateController>(BookfairDateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
