// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
//   UseGuards,
//   Request,
//   UnauthorizedException,
//   UploadedFiles,
//   UseInterceptors,
//   Query,
//   BadRequestException,
// } from '@nestjs/common';
// import { OfferFormService } from './offer-form.service';
// import { CreateOfferFormDto } from './dto/create-offer-form.dto';
// import { UpdateOfferFormDto } from './dto/update-offer-form.dto';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { FileFieldsInterceptor } from '@nestjs/platform-express';

// @Controller('offer-form')
// export class OfferFormController {
//   constructor(private readonly offerFormService: OfferFormService) {}

//   @Post()
//   @UseGuards(JwtAuthGuard)
//   @UseInterceptors(
//     FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
//       limits: { fileSize: 5 * 1024 * 1024 }, // ขนาดไฟล์สูงสุด 5MB
//       fileFilter: (req, file, callback) => {
//         if (!file.mimetype.startsWith('image/')) {
//           return callback(new Error('Only image files are allowed'), false);
//         }
//         callback(null, true);
//       },
//     }),
//   )
//   async create(
//     @Body() createOfferFormDto: CreateOfferFormDto,
//     @Request() req,
//     @UploadedFiles() files: { images?: Express.Multer.File[] },
//   ) {
//     const token = req.headers['authorization']?.split(' ')[1];
//     if (!token) {
//       throw new UnauthorizedException('Token not provided');
//     }
//     console.log('Uploaded files:', files); // ตรวจสอบว่าไฟล์มาถึง Service หรือไม่
//     return this.offerFormService.create(createOfferFormDto, req, files);
//   }

//   @Get('/user')
//   @UseGuards(JwtAuthGuard)
//   async findAllByUser(@Request() req: any) {
//     console.log('Request User:', req.user);
//     const userId = req.user?.userId;
//     if (!userId) {
//       throw new UnauthorizedException('User not authenticated');
//     }
//     return await this.offerFormService.findAllByUser(userId);
//   }

//   @Get()
//   findAll() {
//     return this.offerFormService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.offerFormService.findOne(+id);
//   }

//   @Patch(':id')
//   update(
//     @Param('id') id: string,
//     @Body() updateOfferFormDto: UpdateOfferFormDto,
//   ) {
//     return this.offerFormService.update(+id, updateOfferFormDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.offerFormService.remove(+id);
//   }
// }
