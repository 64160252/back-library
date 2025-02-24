import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferFormsOflDto } from './create-offer-forms-ofl.dto';

export class UpdateOfferFormsOflDto extends PartialType(CreateOfferFormsOflDto) {}
