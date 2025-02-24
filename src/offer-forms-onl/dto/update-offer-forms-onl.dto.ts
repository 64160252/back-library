import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferFormsOnlDto } from './create-offer-forms-onl.dto';

export class UpdateOfferFormsOnlDto extends PartialType(
  CreateOfferFormsOnlDto,
) {}
