import { Test, TestingModule } from '@nestjs/testing';
import { OfferFormService } from './offer-form.service';

describe('OfferFormService', () => {
  let service: OfferFormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfferFormService],
    }).compile();

    service = module.get<OfferFormService>(OfferFormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
