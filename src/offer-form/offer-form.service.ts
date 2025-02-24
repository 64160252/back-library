// import {
//   ConflictException,
//   Injectable,
//   InternalServerErrorException,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { CreateOfferFormDto } from './dto/create-offer-form.dto';
// import { UpdateOfferFormDto } from './dto/update-offer-form.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { OfferForm } from './entities/offer-form.entity';
// import { DeepPartial, Repository } from 'typeorm';
// import { User } from 'src/user/entities/users.entity';
// import { JwtService } from '@nestjs/jwt';
// import * as path from 'path';
// import * as fs from 'fs';
// import { Store } from 'src/all-role/store/entities/store.entity';
// import { Teacher } from 'src/all-role/teacher/entities/teacher.entity';

// @Injectable()
// export class OfferFormService {
//   constructor(
//     @InjectRepository(OfferForm)
//     private readonly offerFormRepository: Repository<OfferForm>,
//     private readonly jwtService: JwtService,
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//     @InjectRepository(Teacher)
//     private readonly teacherRepository: Repository<Teacher>,
//     @InjectRepository(Store)
//     private readonly storeRepository: Repository<Store>,
//   ) {}

//   async create(
//     createOfferFormDto: CreateOfferFormDto,
//     req: Request,
//     files: { images?: Express.Multer.File[] },
//   ): Promise<OfferForm> {
//     const token = req.headers['authorization']?.split(' ')[1];
//     if (!token) {
//       throw new UnauthorizedException('Token not provided');
//     }

//     let decodedToken;
//     try {
//       if (!process.env.JWT_SECRET) {
//         throw new InternalServerErrorException(
//           'JWT_SECRET is not set in environment variables',
//         );
//       }

//       decodedToken = this.jwtService.verify(token, {
//         secret: process.env.JWT_SECRET,
//       });
//     } catch (err) {
//       console.error('Token verification error:', err);
//       throw new UnauthorizedException('Invalid token');
//     }

//     const userId = decodedToken.sub;
//     const user = await this.userRepository.findOne({
//       where: { user_id: userId },
//       relations: ['role', 'faculty', 'department'],
//     });

//     if (!user) {
//       throw new UnauthorizedException(`User not found with ID: ${userId}`);
//     }

//     const teacher = await this.teacherRepository.findOne({
//       where: { user: { user_id: userId } },
//       relations: ['faculty', 'department'],
//     });

//     if (!teacher) {
//       throw new NotFoundException(`Teacher not found for User ID: ${userId}`);
//     }

//     const store = await this.storeRepository.findOne({
//       where: { store_id: createOfferFormDto.store_id },
//     });

//     if (!store) {
//       throw new NotFoundException(
//         `Store with id ${createOfferFormDto.store_id} not found`,
//       );
//     }

//     // สร้างโฟลเดอร์สำหรับเก็บไฟล์ภาพ
//     const uploadDir = path.join(__dirname, '..', 'src', 'images');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     const imagePaths: string[] = [];
//     if (files?.images) {
//       for (const file of files.images) {
//         if (!file.buffer) {
//           throw new InternalServerErrorException(
//             `Invalid file: ${file.originalname}`,
//           );
//         }

//         const filePath = path.join(uploadDir, file.originalname);
//         try {
//           fs.writeFileSync(filePath, file.buffer);
//           imagePaths.push(path.join('images', file.originalname));
//         } catch (err) {
//           console.error('File write error:', err);
//           throw new InternalServerErrorException(
//             'Failed to save uploaded image',
//           );
//         }
//       }
//     }

//     // สร้าง offerForm และบันทึกข้อมูลลงในฐานข้อมูล
//     const offerForm = this.offerFormRepository.create({
//       ...createOfferFormDto,
//       user_fullname:
//         `${teacher.user_prefix || ''} ${teacher.user_firstName || ''} ${teacher.user_lastName || ''}`.trim(),
//       user_name: teacher.user?.user_name || '',
//       user_email: teacher.user?.user_email || '',
//       user_tel: teacher.user?.user_tel || '',
//       faculty: teacher.faculty,
//       department: teacher.department,
//       store,
//       teacher,
//       book_imgs: imagePaths,
//     } as DeepPartial<OfferForm>);

//     try {
//       console.log('Saving offerForm:', offerForm);
//       await this.offerFormRepository.upsert(offerForm, ['ISBN']);
//       console.log('OfferForm saved successfully');
//       return offerForm;
//     } catch (error) {
//       console.error('Database error:', error);
//       if (
//         error.name === 'QueryFailedError' &&
//         error.message.includes('Duplicate entry')
//       ) {
//         throw new ConflictException(
//           `Offer with ISBN ${createOfferFormDto.ISBN} already exists`,
//         );
//       }
//       throw new InternalServerErrorException('Failed to create offer form');
//     }
//   }

//   async findAll(): Promise<OfferForm[]> {
//     return await this.offerFormRepository.find();
//   }

//   // async findAllByUser(userId: number): Promise<OfferForm[]> {
//   //   console.log('Fetching data for UserId:', userId); // ตรวจสอบว่า userId ถูกส่งมา
//   //   return await this.offerFormRepository.find({
//   //     where: { user: { user_id: userId } }, // กรองข้อมูลโดยใช้ userId
//   //   });
//   // }

//   async findOne(id: number): Promise<OfferForm> {
//     return await this.offerFormRepository.findOne({
//       where: { offer_form_id: id },
//     });
//   }

//   // Update
//   async update(
//     id: number,
//     updateOfferFormDto: UpdateOfferFormDto,
//   ): Promise<OfferForm> {
//     const offerForm = await this.findOne(id); // ตรวจสอบว่ามีอยู่ก่อน
//     Object.assign(offerForm, updateOfferFormDto); // รวมข้อมูลใหม่
//     return await this.offerFormRepository.save(offerForm); // บันทึกข้อมูลใหม่
//   }

//   // Remove
//   async remove(id: number): Promise<void> {
//     const offerForm = await this.findOne(id); // ตรวจสอบว่ามีอยู่ก่อน
//     await this.offerFormRepository.remove(offerForm); // ลบข้อมูล
//   }
// }
