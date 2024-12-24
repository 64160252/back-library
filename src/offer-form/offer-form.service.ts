import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOfferFormDto } from './dto/create-offer-form.dto';
import { UpdateOfferFormDto } from './dto/update-offer-form.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OfferForm } from './entities/offer-form.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
import * as fs from 'fs';
import { Market } from 'src/all-role/market/entities/market.entity';

@Injectable()
export class OfferFormService {
  constructor(
    @InjectRepository(OfferForm)
    private readonly offerFormRepository: Repository<OfferForm>,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Market)
    private readonly marketRepository: Repository<Market>,
  ) {}

  // Create
  async create(
    createOfferFormDto: CreateOfferFormDto,
    req: Request,
    files: { images?: Express.Multer.File[] },
  ): Promise<OfferForm> {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    let decodedToken;
    try {
      if (!process.env.JWT_SECRET) {
        throw new InternalServerErrorException(
          'JWT_SECRET is not set in environment variables',
        );
      }

      decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (err) {
      console.error('Token verification error:', err);
      throw new UnauthorizedException('Invalid token');
    }

    const userId = decodedToken.sub;
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ['role', 'faculty', 'department'],
    });

    if (!user) {
      throw new UnauthorizedException(`User not found with ID: ${userId}`);
    }

    const existingOfferForm = await this.offerFormRepository.findOne({
      where: { ISBN: createOfferFormDto.ISBN },
    });

    if (existingOfferForm) {
      throw new ConflictException(
        `Offer with ISBN ${createOfferFormDto.ISBN} already exists`,
      );
    }

    // สร้างโฟลเดอร์สำหรับเก็บไฟล์ภาพ
    const uploadDir = path.join(__dirname, '..', 'src', 'images'); // เปลี่ยนเป็น src/images
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // สร้างโฟลเดอร์ขึ้นมา ถ้าไม่มี
    }

    const imagePaths: string[] = [];
    if (files?.images) {
      for (const file of files.images) {
        if (!file.buffer) {
          throw new InternalServerErrorException(
            `Invalid file: ${file.originalname}`,
          );
        }

        // ตรวจสอบว่ามีไฟล์แล้วหรือไม่
        const filePath = path.join(uploadDir, file.originalname);
        try {
          fs.writeFileSync(filePath, file.buffer); // บันทึกไฟล์ภาพลงในระบบ
          imagePaths.push(path.join('images', file.originalname));
        } catch (err) {
          console.error('File write error:', err);
          throw new InternalServerErrorException(
            'Failed to save uploaded image',
          );
        }
      }
    }

    // สร้าง offerForm และบันทึกข้อมูลลงในฐานข้อมูล
    const offerForm = this.offerFormRepository.create({
      ...createOfferFormDto,
      user_prefix: createOfferFormDto.user_prefix || user.user_prefix || '-',
      user_name: user.user_name,
      role: user.role,
      user_email: user.user_email,
      user_tel: user.user_tel,
      faculty: user.faculty,
      department: user.department,
      market: await this.marketRepository.findOne({
        where: { market_id: createOfferFormDto.market_id },
      }),
      user,
      book_imgs: imagePaths, // เก็บพาธไฟล์ในฐานข้อมูล
    });

    try {
      console.log('Saving offerForm:', offerForm);
      await this.offerFormRepository.upsert(offerForm, ['ISBN']);
      console.log('OfferForm saved successfully');
      return offerForm;
    } catch (error) {
      console.error('Database error:', error);
      if (
        error.name === 'QueryFailedError' &&
        error.message.includes('Duplicate entry')
      ) {
        throw new ConflictException(
          `Offer with ISBN ${createOfferFormDto.ISBN} already exists`,
        );
      }
      throw new InternalServerErrorException('Failed to create offer form');
    }
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
        'offerForms.book_imgs',
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
