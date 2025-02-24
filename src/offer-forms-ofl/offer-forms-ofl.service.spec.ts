import { Test, TestingModule } from '@nestjs/testing';
import { OfferFormsOflService } from './offer-forms-ofl.service';

describe('OfferFormsOflService', () => {
  let service: OfferFormsOflService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfferFormsOflService],
    }).compile();

    service = module.get<OfferFormsOflService>(OfferFormsOflService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
