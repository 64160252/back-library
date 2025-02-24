import { Injectable } from '@nestjs/common';
import { CreateOfferFormsOflDto } from './dto/create-offer-forms-ofl.dto';
import { UpdateOfferFormsOflDto } from './dto/update-offer-forms-ofl.dto';

@Injectable()
export class OfferFormsOflService {
  create(createOfferFormsOflDto: CreateOfferFormsOflDto) {
    return 'This action adds a new offerFormsOfl';
  }

  findAll() {
    return `This action returns all offerFormsOfl`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offerFormsOfl`;
  }

  update(id: number, updateOfferFormsOflDto: UpdateOfferFormsOflDto) {
    return `This action updates a #${id} offerFormsOfl`;
  }

  remove(id: number) {
    return `This action removes a #${id} offerFormsOfl`;
  }
}
