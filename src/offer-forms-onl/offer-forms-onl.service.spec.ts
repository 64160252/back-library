import { Test, TestingModule } from '@nestjs/testing';
import { OfferFormsOnlService } from './offer-forms-onl.service';

describe('OfferFormsOnlService', () => {
  let service: OfferFormsOnlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfferFormsOnlService],
    }).compile();

    service = module.get<OfferFormsOnlService>(OfferFormsOnlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
