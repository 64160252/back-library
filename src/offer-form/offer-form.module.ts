import { Module } from '@nestjs/common';
import { OfferFormService } from './offer-form.service';
import { OfferFormController } from './offer-form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferForm } from './entities/offer-form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OfferForm])], // เชื่อมโยง Repository
  controllers: [OfferFormController],
  providers: [OfferFormService],
  exports: [OfferFormService],
})
export class OfferFormModule {}
