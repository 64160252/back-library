import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OfferFormsOnlService } from './offer-forms-onl.service';
import { CreateOfferFormsOnlDto } from './dto/create-offer-forms-onl.dto';
import { UpdateOfferFormsOnlDto } from './dto/update-offer-forms-onl.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Controller('offer-forms-onl')
export class OfferFormsOnlController {
  constructor(private readonly offerFormsOnlService: OfferFormsOnlService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createOfferFormsOnlDto: CreateOfferFormsOnlDto,
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.offerFormsOnlService.create(createOfferFormsOnlDto, req, updateUserDto);
  }


  @Get()
  findAll() {
    return this.offerFormsOnlService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offerFormsOnlService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOfferFormsOnlDto: UpdateOfferFormsOnlDto,
  ) {
    return this.offerFormsOnlService.update(+id, updateOfferFormsOnlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offerFormsOnlService.remove(+id);
  }
}
