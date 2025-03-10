import { Test, TestingModule } from '@nestjs/testing';
import { BookfairDateService } from './bookfair-date.service';

describe('BookfairDateService', () => {
  let service: BookfairDateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookfairDateService],
    }).compile();

    service = module.get<BookfairDateService>(BookfairDateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
