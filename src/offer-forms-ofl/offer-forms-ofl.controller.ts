import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,
  Request,UseInterceptors, UploadedFiles
} from '@nestjs/common';
import { OfferFormsOflService } from './offer-forms-ofl.service';
import { CreateOfferFormsOflDto } from './dto/create-offer-forms-ofl.dto';
import { UpdateOfferFormsOflDto } from './dto/update-offer-forms-ofl.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Express } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('offer-forms-ofl')
export class OfferFormsOflController {
  constructor(private readonly offerFormsOflService: OfferFormsOflService) { }

  @Post()
  @UseInterceptors(
    FilesInterceptor('imgs', 10, {
      storage: diskStorage({
        destination: './uploads/offer-forms-ofl', // 📌 เก็บรูปที่นี่
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() createOfferFormsOflDto: CreateOfferFormsOflDto,
    @Request() req,
    @UploadedFiles() imgs: Express.Multer.File[],
  ) {
    return this.offerFormsOflService.create(createOfferFormsOflDto, req, imgs);
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
  update(
    @Param('id') id: string,
    @Body() updateOfferFormsOflDto: UpdateOfferFormsOflDto,
  ) {
    return this.offerFormsOflService.update(+id, updateOfferFormsOflDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offerFormsOflService.remove(+id);
  }
}
