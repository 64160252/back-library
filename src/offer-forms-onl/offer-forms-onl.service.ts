import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateOfferFormsOnlDto } from './dto/create-offer-forms-onl.dto';
import { UpdateOfferFormsOnlDto } from './dto/update-offer-forms-onl.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { OfferFormsOnl } from './entities/offer-forms-onl.entity';

@Injectable()
export class OfferFormsOnlService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(OfferFormsOnl)
    private readonly offerFormsOnlRepository: Repository<OfferFormsOnl>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ฟังก์ชันสร้าง ฟอร์ม
  async create(
    createOfferFormsOnlDto: CreateOfferFormsOnlDto,
    req: Request,
  ): Promise<OfferFormsOnl> {
    const { ...offerFormsOnlData } = createOfferFormsOnlDto;

    try {
      const token = req.headers['authorization']?.split(' ')[1];

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

      const userEntity = await this.userRepository.findOne({
        where: { user_id: userId },
        relations: ['role', 'teacher', 'student'],
      });

      const user_name =
        userEntity.role.role_name === 'Teacher' && userEntity.teacher
          ? `${userEntity.teacher.user_prefix || ''} ${userEntity.teacher.user_firstName || ''} ${userEntity.teacher.user_lastName || ''}`.trim()
          : userEntity.role.role_name === 'Student' && userEntity.student
            ? `${userEntity.student.user_prefix || ''} ${userEntity.student.user_firstName || ''} ${userEntity.student.user_lastName || ''}`.trim()
            : userEntity.user_name;

      const role_offer =
        userEntity.role.role_name === 'Teacher' &&
        userEntity.teacher &&
        userEntity.teacher.role_offer
          ? userEntity.teacher.role_offer
          : userEntity.role.role_name === 'Student' &&
              userEntity.student &&
              userEntity.student.role_offer
            ? userEntity.student.role_offer
            : '';

      const faculty_name =
        userEntity.role.role_name === 'Teacher' &&
        userEntity.teacher &&
        userEntity.teacher.faculty_name
          ? userEntity.teacher.faculty_name
          : userEntity.role.role_name === 'Student' &&
              userEntity.student &&
              userEntity.student.faculty_name
            ? userEntity.student.faculty_name
            : '';

      const department_name =
        userEntity.role.role_name === 'Teacher' &&
        userEntity.teacher &&
        userEntity.teacher.department_name
          ? userEntity.teacher.department_name
          : userEntity.role.role_name === 'Student' &&
              userEntity.student &&
              userEntity.student.department_name
            ? userEntity.student.department_name
            : '';

      const offerFormsOnl = this.offerFormsOnlRepository.create({
        ...offerFormsOnlData,
        user: userEntity,
        user_name,
        user_email: userEntity.user_email,
        user_tel: userEntity.user_tel,
        role_offer,
        faculty_name,
        department_name,
      });

      const savedOfferFormsOnl =
        await this.offerFormsOnlRepository.save(offerFormsOnl);
      return savedOfferFormsOnl;
    } catch (error) {
      throw new BadRequestException(
        `OfferFormsOnl creation failed: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันค้นหา ฟอร์ม ทั้งหมด
  async findAll(): Promise<OfferFormsOnl[]> {
    return await this.offerFormsOnlRepository
      .createQueryBuilder('offerFormsOnl')
      .getMany();
  }

  // ฟังก์ชันค้นหา ฟอร์ม ตาม id
  async findOne(id: number): Promise<OfferFormsOnl> {
    return await this.offerFormsOnlRepository
      .createQueryBuilder('offerFormsOnl')
      .where('offerFormsOnl.offerForms_onl_id = :id', { id })
      .getOne();
  }

  // ฟังก์ชันแก้ไข ฟอร์ม
  async update(
    id: number,
    updateOfferFormsOnlDto: UpdateOfferFormsOnlDto,
  ): Promise<OfferFormsOnl> {
    try {
      const offerFormsOnl = await this.offerFormsOnlRepository.findOne({
        where: { offerForms_onl_id: id },
      });
      if (!offerFormsOnl) {
        throw new NotFoundException(`OfferFormsOnl with ID ${id} not found`);
      }
      const updatedOfferFormsOnl = Object.assign(
        offerFormsOnl,
        updateOfferFormsOnlDto,
      );
      return this.offerFormsOnlRepository.save(updatedOfferFormsOnl);
    } catch (error) {
      throw new BadRequestException(
        `Failed to update OfferFormsOnl: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันลบ ฟอร์ม
  async remove(id: number): Promise<OfferFormsOnl> {
    try {
      const offerFormsOnl = await this.offerFormsOnlRepository.findOne({
        where: { offerForms_onl_id: id },
      });
      if (!offerFormsOnl) {
        throw new NotFoundException(`OfferFormsOnl with ID ${id} not found.`);
      }
      const deletedOfferFormsOnl = Object.assign(
        offerFormsOnl,
        UpdateOfferFormsOnlDto,
      );
      return this.offerFormsOnlRepository.remove(deletedOfferFormsOnl);
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete OfferFormsOnl: ${error.message}`,
      );
    }
  }
}
