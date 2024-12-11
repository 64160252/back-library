import { Test, TestingModule } from '@nestjs/testing';
import { OfferFormController } from './offer-form.controller';
import { OfferFormService } from './offer-form.service';

describe('OfferFormController', () => {
  let controller: OfferFormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferFormController],
      providers: [OfferFormService],
    }).compile();

    controller = module.get<OfferFormController>(OfferFormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
