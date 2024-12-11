import { Injectable } from '@nestjs/common';
import { CreateOfferFormDto } from './dto/create-offer-form.dto';
import { UpdateOfferFormDto } from './dto/update-offer-form.dto';

@Injectable()
export class OfferFormService {
  create(createOfferFormDto: CreateOfferFormDto) {
    return 'This action adds a new offerForm';
  }

  findAll() {
    return `This action returns all offerForm`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offerForm`;
  }

  update(id: number, updateOfferFormDto: UpdateOfferFormDto) {
    return `This action updates a #${id} offerForm`;
  }

  remove(id: number) {
    return `This action removes a #${id} offerForm`;
  }
}
