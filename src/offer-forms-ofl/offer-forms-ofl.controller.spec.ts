import { Test, TestingModule } from '@nestjs/testing';
import { OfferFormsOflController } from './offer-forms-ofl.controller';
import { OfferFormsOflService } from './offer-forms-ofl.service';

describe('OfferFormsOflController', () => {
  let controller: OfferFormsOflController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferFormsOflController],
      providers: [OfferFormsOflService],
    }).compile();

    controller = module.get<OfferFormsOflController>(OfferFormsOflController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
