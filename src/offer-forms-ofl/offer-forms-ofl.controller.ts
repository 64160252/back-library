import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OfferFormsOflService } from './offer-forms-ofl.service';
import { CreateOfferFormsOflDto } from './dto/create-offer-forms-ofl.dto';
import { UpdateOfferFormsOflDto } from './dto/update-offer-forms-ofl.dto';

@Controller('offer-forms-ofl')
export class OfferFormsOflController {
  constructor(private readonly offerFormsOflService: OfferFormsOflService) {}

  @Post()
  create(@Body() createOfferFormsOflDto: CreateOfferFormsOflDto) {
    return this.offerFormsOflService.create(createOfferFormsOflDto);
  }

  @Get()
  findAll() {
    return this.offerFormsOflService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offerFormsOflService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfferFormsOflDto: UpdateOfferFormsOflDto) {
    return this.offerFormsOflService.update(+id, updateOfferFormsOflDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offerFormsOflService.remove(+id);
  }
}
