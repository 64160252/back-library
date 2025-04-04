import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOfferFormsOflDto } from './dto/create-offer-forms-ofl.dto';
import { UpdateOfferFormsOflDto } from './dto/update-offer-forms-ofl.dto';
import { Department } from 'src/departments/entities/department.entity';
import { Faculty } from 'src/faculties/entities/faculty.entity';
import { Library } from 'src/library/entities/library.entity';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/entities/user.entity';
import { OfferFormsOfl } from './entities/offer-forms-ofl.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Store } from 'src/Role-and-Duty/store/entities/store.entity';
import { Book } from 'src/books/entities/book.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as multer from 'multer';

@Injectable()
export class OfferFormsOflService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(OfferFormsOfl)
    private readonly offerFormsOflRepository: Repository<OfferFormsOfl>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Library)
    private readonly libraryRepository: Repository<Library>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) { }

  // ฟังก์ชันสร้าง ฟอร์ม
  async create(
    createOfferFormsOflDto: CreateOfferFormsOflDto,
    req: Request,
    imgs: Express.Multer.File[],
  ): Promise<OfferFormsOfl> {
    const { book, form_description, user, faculty, department, store } = createOfferFormsOflDto;
  
    try {
      // ✅ ค้นหา Entities ที่เกี่ยวข้อง
      const [userEntity, facultyEntity, departmentEntity, storeEntity, bookEntity, library] =
        await Promise.all([
          this.userRepository.findOne({ where: { user_id: user }, relations: ['role', 'teacher', 'student'] }),
          this.facultyRepository.findOne({ where: { faculty_id: faculty } }),
          this.departmentRepository.findOne({ where: { department_id: department } }),
          this.storeRepository.findOne({ where: { store_id: store } }),
          this.bookRepository.findOne({ where: { book_id: book } }),
          this.libraryRepository.findOne({ where: { library_id: 1 } }),
        ]);
  
      if (!userEntity) throw new NotFoundException('User not found');
      if (!facultyEntity) throw new NotFoundException('Faculty not found');
      if (!departmentEntity) throw new NotFoundException('Department not found');
      if (!storeEntity) throw new NotFoundException('Store not found');
      if (!bookEntity) throw new NotFoundException('Book not found');
      if (!library) throw new NotFoundException('Library with ID 1 not found');
  
      // ✅ ดึงค่าข้อมูลของ User
      const user_name =
        userEntity.role.role_name === 'Teacher' && userEntity.teacher
          ? `${userEntity.teacher.user_prefix} ${userEntity.teacher.user_firstName} ${userEntity.teacher.user_lastName}`.trim()
          : userEntity.role.role_name === 'Student' && userEntity.student
            ? `${userEntity.student.user_prefix} ${userEntity.student.user_firstName} ${userEntity.student.user_lastName}`.trim()
            : userEntity.user_name;
  
      const role_offer = userEntity.role.role_name;
      const user_email = userEntity.user_email || 'ไม่พบอีเมล';
      const user_tel = userEntity.user_tel || 'ไม่พบเบอร์โทร';
  
      // ✅ ดึงชื่อไฟล์ที่อัปโหลด
      const savedImgs = imgs.map((img) => img.filename);
  
      // ✅ สร้าง OfferFormsOfl
      const offerFormsOfl = this.offerFormsOflRepository.create({
        book: bookEntity,
        ISBN: bookEntity.ISBN,
        book_title: bookEntity.book_title,
        book_author: bookEntity.book_author,
        book_course: bookEntity.book_category || 'ไม่ระบุ',
        price: bookEntity.book_price,
        form_description,
        user: userEntity,
        user_name,
        role_offer,
        user_email,
        user_tel,
        faculty: facultyEntity,
        faculty_name: facultyEntity.faculty_name,
        department: departmentEntity,
        department_name: departmentEntity.department_name,
        store: storeEntity,
        store_name: storeEntity.store_name,
        library,
        imgs: savedImgs.length > 0 ? JSON.stringify(savedImgs) : null,
        status: 'กำลังดำเนินการ',
      });
  
      // ✅ บันทึกข้อมูลลงฐานข้อมูล
      return await this.offerFormsOflRepository.save(offerFormsOfl);
    } catch (error) {
      throw new BadRequestException(`OfferFormsOfl creation failed: ${error.message}`);
    }
  }

  // ฟังก์ชันค้นหา ฟอร์ม ทั้งหมด
  async findAll(): Promise<OfferFormsOfl[]> {
    return await this.offerFormsOflRepository
      .createQueryBuilder('OfferFormsOfl')
      .leftJoinAndSelect('OfferFormsOfl.user', 'user')
      .leftJoinAndSelect('OfferFormsOfl.library', 'library')
      .leftJoinAndSelect('OfferFormsOfl.faculty', 'faculty')
      .leftJoinAndSelect('OfferFormsOfl.department', 'department')
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
  async findOne(id: number): Promise<OfferFormsOfl> {
    return await this.offerFormsOflRepository
      .createQueryBuilder('OfferFormsOfl')
      .leftJoinAndSelect('OfferFormsOfl.user', 'user')
      .leftJoinAndSelect('OfferFormsOfl.library', 'library')
      .leftJoinAndSelect('OfferFormsOfl.faculty', 'faculty')
      .leftJoinAndSelect('OfferFormsOfl.department', 'department')
      // เพิ่มการ join ข้อมูลที่เกี่ยวข้องกับ user
      .leftJoinAndSelect('user.executive', 'executive')
      .leftJoinAndSelect('user.admin', 'admin')
      .leftJoinAndSelect('user.staffLibrary', 'staffLibrary')
      .leftJoinAndSelect('user.staffFaculty', 'staffFaculty')
      .leftJoinAndSelect('user.staffDepartment', 'staffDepartment')
      .leftJoinAndSelect('user.teacher', 'teacher')
      .leftJoinAndSelect('user.student', 'student')
      .leftJoinAndSelect('user.store', 'store')
      .where('OfferFormsOfl.offerForms_ofl_id = :id', { id })
      .getOne();
  }

  // ฟังก์ชันแก้ไข ฟอร์ม
  async update(
    id: number,
    updateOfferFormsOflDto: UpdateOfferFormsOflDto,
  ): Promise<OfferFormsOfl> {
    try {
      const OfferFormsOfl = await this.offerFormsOflRepository.findOne({
        where: { offerForms_ofl_id: id },
      });
      if (!OfferFormsOfl) {
        throw new NotFoundException(`OfferFormsOfl with ID ${id} not found`);
      }
      const updatedOfferFormsOfl = Object.assign(
        OfferFormsOfl,
        updateOfferFormsOflDto,
      );
      return this.offerFormsOflRepository.save(updatedOfferFormsOfl);
    } catch (error) {
      throw new BadRequestException(
        `Failed to update OfferFormsOfl: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันลบ ฟอร์ม
  async remove(id: number): Promise<OfferFormsOfl> {
    try {
      const OfferFormsOfl = await this.offerFormsOflRepository.findOne({
        where: { offerForms_ofl_id: id },
      });
      if (!OfferFormsOfl) {
        throw new NotFoundException(`OfferFormsOfl with ID ${id} not found.`);
      }
      const deletedOfferFormsOfl = Object.assign(
        OfferFormsOfl,
        UpdateOfferFormsOflDto,
      );
      return this.offerFormsOflRepository.remove(deletedOfferFormsOfl);
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete OfferFormsOfl: ${error.message}`,
      );
    }
  }
}
