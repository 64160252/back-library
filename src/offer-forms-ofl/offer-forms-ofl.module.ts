import { Module } from '@nestjs/common';
import { OfferFormsOflService } from './offer-forms-ofl.service';
import { OfferFormsOflController } from './offer-forms-ofl.controller';

@Module({
  controllers: [OfferFormsOflController],
  providers: [OfferFormsOflService],
})
export class OfferFormsOflModule {}
