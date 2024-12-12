import { Injectable } from '@nestjs/common';
import { CreateOfferFormDto } from './dto/create-offer-form.dto';
import { UpdateOfferFormDto } from './dto/update-offer-form.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferForm } from './entities/offer-form.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OfferFormService {
  constructor(
    @InjectRepository(OfferForm)
    private readonly offerFormRepository: Repository<OfferForm>,
  ) {}

  // Create
  async create(createOfferFormDto: CreateOfferFormDto): Promise<OfferForm> {
    const offerForm = this.offerFormRepository.create(createOfferFormDto);
    return this.offerFormRepository.save(offerForm);
  }

  // Find all
  async findAll(): Promise<OfferForm[]> {
    return await this.offerFormRepository.find();
  }

  // Find one
  async findOne(id: number): Promise<OfferForm> {
    return await this.offerFormRepository
      .createQueryBuilder('offerForms')
      .select([
        'offerForms.offer_form_id',
        'offerForms.market_name',
        'offerForms.book_title',
        'offerForms.book_author',
        'offerForms.published_year',
        'offerForms.ISBN',
        'offerForms.book_subject',
        'offerForms.book_price',
        'offerForms.book_quantity',
        'offerForms.book_file',
      ])
      .where('offerForms.offer_form_id = :id', { id })
      .getOne();
  }


  // Update
  async update(
    id: number,
    updateOfferFormDto: UpdateOfferFormDto,
  ): Promise<OfferForm> {
    const offerForm = await this.findOne(id); // ตรวจสอบว่ามีอยู่ก่อน
    Object.assign(offerForm, updateOfferFormDto); // รวมข้อมูลใหม่
    return await this.offerFormRepository.save(offerForm); // บันทึกข้อมูลใหม่
  }

  // Remove
  async remove(id: number): Promise<void> {
    const offerForm = await this.findOne(id); // ตรวจสอบว่ามีอยู่ก่อน
    await this.offerFormRepository.remove(offerForm); // ลบข้อมูล
  }
}
