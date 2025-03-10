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
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Department } from 'src/departments/entities/department.entity';
import { Faculty } from 'src/faculties/entities/faculty.entity';
import { Library } from 'src/library/entities/library.entity';

@Injectable()
export class OfferFormsOnlService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(OfferFormsOnl)
    private readonly offerFormsOnlRepository: Repository<OfferFormsOnl>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Library)
    private readonly libraryRepository: Repository<Library>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) { }

  // ฟังก์ชันสร้าง ฟอร์ม
  async create(
    createOfferFormsOnlDto: CreateOfferFormsOnlDto,
    req: Request,
    updateUserDto: UpdateUserDto,
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

      if (!userEntity) {
        throw new NotFoundException('User not found');
      }

      const user_email = updateUserDto.user_email || userEntity.user_email;
      const user_tel = updateUserDto.user_tel || userEntity.user_tel;

      const user_name =
        userEntity.role.role_name === 'Teacher' && userEntity.teacher
          ? `${userEntity.teacher.user_prefix || ''} ${userEntity.teacher.user_firstName || ''} ${userEntity.teacher.user_lastName || ''}`.trim()
          : userEntity.role.role_name === 'Student' && userEntity.student
            ? `${userEntity.student.user_prefix || ''} ${userEntity.student.user_firstName || ''} ${userEntity.student.user_lastName || ''}`.trim()
            : userEntity.user_name;

      const role_offer =
        userEntity.role.role_name === 'Teacher' && userEntity.teacher
          ? userEntity.teacher.role_offer
          : userEntity.role.role_name === 'Student' && userEntity.student
            ? userEntity.student.role_offer
            : '';

      const faculty_name =
        userEntity.role.role_name === 'Teacher' && userEntity.teacher
          ? userEntity.teacher.faculty_name
          : userEntity.role.role_name === 'Student' && userEntity.student
            ? userEntity.student.faculty_name
            : '';

      const department_name =
        userEntity.role.role_name === 'Teacher' && userEntity.teacher
          ? userEntity.teacher.department_name
          : userEntity.role.role_name === 'Student' && userEntity.student
            ? userEntity.student.department_name
            : '';

      // ✅ ค้นหา Faculty และ Department ตามชื่อ
      const faculty = faculty_name
        ? await this.facultyRepository.findOne({ where: { faculty_name } })
        : null;

      const department = department_name
        ? await this.departmentRepository.findOne({ where: { department_name } })
        : null;

      // ✅ ค้นหา Library ที่มี ID = 1 (ค่า default)
      const library = await this.libraryRepository.findOne({ where: { library_id: 1 } });

      if (!library) {
        throw new NotFoundException('Library with ID 1 not found');
      }

      const offerFormsOnl = this.offerFormsOnlRepository.create({
        ...offerFormsOnlData,
        user: userEntity,
        user_name,
        user_email,
        user_tel,
        role_offer,
        faculty_name,
        department_name,
        faculty: faculty || null,
        department: department || null,
        library, // ✅ กำหนดค่า library เป็น default = ID 1
      });

      const savedOfferFormsOnl = await this.offerFormsOnlRepository.save(offerFormsOnl);
      return savedOfferFormsOnl;
    } catch (error) {
      throw new BadRequestException(`OfferFormsOnl creation failed: ${error.message}`);
    }
  }

  // ฟังก์ชันค้นหา ฟอร์ม ทั้งหมด
  async findAll(): Promise<OfferFormsOnl[]> {
    return await this.offerFormsOnlRepository
      .createQueryBuilder('offerFormsOnl')
      .leftJoinAndSelect('offerFormsOnl.user', 'user')
      .leftJoinAndSelect('offerFormsOnl.library', 'library')
      .leftJoinAndSelect('offerFormsOnl.faculty', 'faculty')
      .leftJoinAndSelect('offerFormsOnl.department', 'department')
      // เพิ่มการ join ข้อมูลที่เกี่ยวข้องกับ user
      .leftJoinAndSelect('user.executive', 'executive')
      .leftJoinAndSelect('user.admin', 'admin')
      .leftJoinAndSelect('user.staffLibrary', 'staffLibrary')
      .leftJoinAndSelect('user.staffFaculty', 'staffFaculty')
      .leftJoinAndSelect('user.staffDepartment', 'staffDepartment')
      .leftJoinAndSelect('user.teacher', 'teacher')
      .leftJoinAndSelect('user.student', 'student')
      .leftJoinAndSelect('user.store', 'store')
      .getMany();
  }

  // ฟังก์ชันค้นหา ฟอร์ม ตาม id
  async findOne(id: number): Promise<OfferFormsOnl> {
    return await this.offerFormsOnlRepository
      .createQueryBuilder('offerFormsOnl')
      .leftJoinAndSelect('offerFormsOnl.user', 'user')
      .leftJoinAndSelect('offerFormsOnl.library', 'library')
      .leftJoinAndSelect('offerFormsOnl.faculty', 'faculty')
      .leftJoinAndSelect('offerFormsOnl.department', 'department')
      // เพิ่มการ join ข้อมูลที่เกี่ยวข้องกับ user
      .leftJoinAndSelect('user.executive', 'executive')
      .leftJoinAndSelect('user.admin', 'admin')
      .leftJoinAndSelect('user.staffLibrary', 'staffLibrary')
      .leftJoinAndSelect('user.staffFaculty', 'staffFaculty')
      .leftJoinAndSelect('user.staffDepartment', 'staffDepartment')
      .leftJoinAndSelect('user.teacher', 'teacher')
      .leftJoinAndSelect('user.student', 'student')
      .leftJoinAndSelect('user.store', 'store')
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
