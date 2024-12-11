import { Module } from '@nestjs/common';
import { OfferFormService } from './offer-form.service';
import { OfferFormController } from './offer-form.controller';

@Module({
  controllers: [OfferFormController],
  providers: [OfferFormService],
})
export class OfferFormModule {}
