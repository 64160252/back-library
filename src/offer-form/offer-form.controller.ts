import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OfferFormService } from './offer-form.service';
import { CreateOfferFormDto } from './dto/create-offer-form.dto';
import { UpdateOfferFormDto } from './dto/update-offer-form.dto';

@Controller('offer-form')
export class OfferFormController {
  constructor(private readonly offerFormService: OfferFormService) {}

  @Post()
  create(@Body() createOfferFormDto: CreateOfferFormDto) {
    return this.offerFormService.create(createOfferFormDto);
  }

  @Get()
  findAll() {
    return this.offerFormService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offerFormService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOfferFormDto: UpdateOfferFormDto,
  ) {
    return this.offerFormService.update(+id, updateOfferFormDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offerFormService.remove(+id);
  }
}
