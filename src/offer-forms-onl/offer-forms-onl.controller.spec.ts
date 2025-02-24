import { Test, TestingModule } from '@nestjs/testing';
import { OfferFormsOnlController } from './offer-forms-onl.controller';
import { OfferFormsOnlService } from './offer-forms-onl.service';

describe('OfferFormsOnlController', () => {
  let controller: OfferFormsOnlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferFormsOnlController],
      providers: [OfferFormsOnlService],
    }).compile();

    controller = module.get<OfferFormsOnlController>(OfferFormsOnlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
