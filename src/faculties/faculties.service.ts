import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Faculty } from './entities/faculty.entity';
import { Library } from 'src/library/entities/library.entity';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    @InjectRepository(Library)
    private readonly libraryRepository: Repository<Library>,
  ) { }

  // ฟังก์ชันสร้าง คณะ
  async create(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    try {
      const faculty = this.facultyRepository.create(createFacultyDto);

      const savedFaculty = await this.facultyRepository.save(faculty);
      return savedFaculty;
    } catch (error) {
      throw new BadRequestException(
        `Faculty creation failed: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันค้นหา คณะ ทั้งหมด
  async findAll(): Promise<Faculty[]> {
    return await this.facultyRepository
      .createQueryBuilder('faculties')
      .leftJoinAndSelect('faculties.departments', 'departments')
      .select([
        'faculties.faculty_id',
        'faculties.faculty_name',
        'faculties.e_coupon',
        'departments.department_id',
        'departments.department_name',
      ])
      .getMany();
  }

  // ฟังก์ชันค้นหา คณะ ตาม id
  async findOne(facultyId: number): Promise<Faculty> {
    return await this.facultyRepository
      .createQueryBuilder('faculties')
      .leftJoinAndSelect('faculties.departments', 'departments')
      .select([
        'faculties.faculty_id',
        'faculties.faculty_name',
        'faculties.e_coupon',
        'departments.department_id',
        'departments.department_name',
      ])
      .where('faculties.faculty_id = :facultyId', { facultyId })
      .getOne();
  }

  // ฟังก์ชันแก้ไข งบประมาณ
  async update(
    facultyId: number,
    updateFacultyDto: UpdateFacultyDto,
  ): Promise<Faculty> {
    try {
      const faculty = await this.facultyRepository.findOne({
        where: { faculty_id: facultyId },
      });
      if (!faculty) {
        throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
      }
      const updatedFaculty = Object.assign(faculty, updateFacultyDto);
      return this.facultyRepository.save(updatedFaculty);
    } catch (error) {
      throw new BadRequestException(
        `Failed to update Faculty: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันแก้ไข เพิ่มงบประมาณคณะ หักจากงบประมาณหอสมุด
  async libraryUpdate(
    facultyId: number,
    updateFacultyDto: UpdateFacultyDto,
  ): Promise<Faculty> {
    try {
      const faculty = await this.facultyRepository.findOne({
        where: { faculty_id: facultyId },
        relations: ['library'],
      });

      if (!faculty) {
        throw new NotFoundException(`Faculty with ID ${facultyId} not found`);
      }

      if (!faculty.library) {
        throw new NotFoundException(`Library for Faculty ID ${facultyId} not found`);
      }

      if (updateFacultyDto.e_coupon === undefined || updateFacultyDto.e_coupon === null) {
        throw new BadRequestException(`e_coupon is required`);
      }

      // กำหนดค่าเริ่มต้นให้ e_coupon และ budget_used
      const currentECoupon = faculty.e_coupon ?? 0;
      const currentBudgetRemain = faculty.library.budget_remain ?? 0;
      const currentBudgetUsed = faculty.library.budget_used ?? 0;
      const currentBudgetCount = faculty.budget_count ?? 0; // ค่าเริ่มต้นสำหรับ budget_count

      // ตรวจสอบว่า e_coupon ที่ส่งมาเป็นการเพิ่มเท่านั้น (ห้ามลด)
      if (updateFacultyDto.e_coupon < currentECoupon) {
        throw new BadRequestException(`Cannot decrease e_coupon value`);
      }

      const eCouponDiff = updateFacultyDto.e_coupon - currentECoupon; // คำนวณการเพิ่ม

      // ตรวจสอบว่ามีงบประมาณเพียงพอ
      if (eCouponDiff > currentBudgetRemain) {
        throw new BadRequestException(`Not enough budget to allocate`);
      }

      // อัปเดตค่าต่าง ๆ
      faculty.e_coupon = updateFacultyDto.e_coupon;
      faculty.library.budget_remain = currentBudgetRemain - eCouponDiff;
      faculty.library.budget_used = currentBudgetUsed + eCouponDiff;

      // เพิ่มจำนวน budget_count ที่ faculty
      faculty.budget_count = currentBudgetCount + 1;

      // บันทึกการอัปเดต
      await this.facultyRepository.save(faculty);
      await this.libraryRepository.save(faculty.library);

      const updatedFaculty = await this.facultyRepository.findOne({
        where: { faculty_id: facultyId },
        relations: ['library'],
      });

      return updatedFaculty;
    } catch (error) {
      throw new BadRequestException(`Failed to update Faculty: ${error.message}`);
    }
  }

  // ฟังก์ชันลบ คณะ
  async remove(facultyId: number): Promise<Faculty> {
    try {
      // ค้นหาคณะตาม ID พร้อมข้อมูลที่เชื่อมโยง
      const faculty = await this.facultyRepository.findOne({
        where: { faculty_id: facultyId },
        relations: ['library'],
      });

      if (!faculty) {
        throw new NotFoundException(`Faculty with ID ${facultyId} not found.`);
      }

      if (!faculty.library) {
        throw new NotFoundException(`Library for Faculty ID ${facultyId} not found.`);
      }

      // เรียกใช้ฟังก์ชัน libraryUpdate เพื่ออัปเดตค่า e_coupon ให้เป็น 0
      const updateFacultyDto = { e_coupon: 0 }; // ตั้งค่า e_coupon เป็น 0
      await this.libraryUpdate(facultyId, updateFacultyDto); // เรียกฟังก์ชันการอัปเดตที่ใช้งานอยู่

      // ทำการ soft remove คณะ (จะตั้งค่า deletedAt ให้เป็นเวลาปัจจุบัน)
      await this.facultyRepository.softRemove(faculty);

      return faculty;
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete Faculty: ${error.message}`,
      );
    }
  }
}
