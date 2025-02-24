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
  ) {}

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

  // ฟังก์ชันแก้ไข เพิ่มงบประมาณคณะ
  async update(
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
        throw new NotFoundException(
          `Library for Faculty ID ${facultyId} not found`,
        );
      }

      if (updateFacultyDto.e_coupon === undefined) {
        throw new BadRequestException(`e_coupon is required`);
      }

      const eCouponDiff = updateFacultyDto.e_coupon - (faculty.e_coupon || 0);

      const library = await this.libraryRepository
        .createQueryBuilder('library')
        .where('library.library_id = :libraryId', {
          libraryId: faculty.library.library_id,
        })
        .getOne();

      if (!library) {
        throw new NotFoundException(
          `Library with ID ${faculty.library.library_id} not found`,
        );
      }

      if (eCouponDiff > library.budget_amount) {
        throw new BadRequestException(`Not enough budget to allocate`);
      }

      faculty.e_coupon = updateFacultyDto.e_coupon;
      library.budget_amount -= eCouponDiff;

      await this.facultyRepository.save(faculty);
      await this.libraryRepository.save(library);

      const updatedFaculty = await this.facultyRepository.findOne({
        where: { faculty_id: facultyId },
        relations: ['library'],
      });

      return updatedFaculty;
    } catch (error) {
      throw new BadRequestException(
        `Failed to update Faculty: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันลบ คณะ
  async remove(facultyId: number): Promise<Faculty> {
    try {
      const faculty = await this.facultyRepository.findOne({
        where: { faculty_id: facultyId },
      });
      if (!faculty) {
        throw new NotFoundException(`Faculty with ID ${facultyId} not found.`);
      }
      const deletedFaculty = Object.assign(faculty, UpdateFacultyDto);
      return this.facultyRepository.remove(deletedFaculty);
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete Faculty: ${error.message}`,
      );
    }
  }
}
