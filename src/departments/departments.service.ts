import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faculty } from 'src/faculties/entities/faculty.entity';
import { Department } from './entities/department.entity';
import { Library } from 'src/library/entities/library.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    @InjectRepository(Library)
    private readonly libraryRepository: Repository<Library>,
  ) {}

  // ฟังก์ชันสร้าง สาขา
  async create(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department[]> {
    const { department_names, faculty, ...departmentData } =
      createDepartmentDto;

    try {
      const facultyEntity = await this.facultyRepository.findOne({
        where: { faculty_id: faculty },
      });

      const departments = department_names.map((name) =>
        this.departmentRepository.create({
          ...departmentData,
          department_name: name,
          faculty: facultyEntity,
          faculty_name: facultyEntity.faculty_name,
        }),
      );

      const savedDepartment = await this.departmentRepository.save(departments);
      return savedDepartment;
    } catch (error) {
      throw new BadRequestException(
        `Department creation failed: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันค้นหา สาขา ทั้งหมด
  async findAll(): Promise<Department[]> {
    return await this.departmentRepository
      .createQueryBuilder('department')
      .getMany();
  }

  // ฟังก์ชันค้นหา สาขา ตาม id
  async findOne(departmentId: number): Promise<Department> {
    return await this.departmentRepository
      .createQueryBuilder('department')
      .where('department.department_id = :departmentId', { departmentId })
      .getOne();
  }

  // ฟังก์ชันแก้ไข เพิ่มงบประมาณสาขา หักจากงบประมาณคณะ
  async libraryUpdate(
    departmentId: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    try {
      const department = await this.departmentRepository.findOne({
        where: { department_id: departmentId },
        relations: ['library'],
      });

      if (!department) {
        throw new NotFoundException(
          `Department with ID ${departmentId} not found`,
        );
      }

      if (!department.library) {
        throw new NotFoundException(
          `Library for Department ID ${departmentId} not found`,
        );
      }

      if (updateDepartmentDto.e_coupon === undefined) {
        throw new BadRequestException(`e_coupon is required`);
      }

      const eCouponDiff =
        updateDepartmentDto.e_coupon - (department.e_coupon || 0);

      const library = await this.libraryRepository
        .createQueryBuilder('library')
        .where('library.library_id = :libraryId', {
          libraryId: department.library.library_id,
        })
        .getOne();

      if (!library) {
        throw new NotFoundException(
          `Library with ID ${department.library.library_id} not found`,
        );
      }

      if (eCouponDiff > library.budget_amount) {
        throw new BadRequestException(`Not enough budget to allocate`);
      }

      department.e_coupon = updateDepartmentDto.e_coupon;
      library.budget_amount -= eCouponDiff;

      await this.departmentRepository.save(department);
      await this.libraryRepository.save(library);

      const updatedDepartment = await this.departmentRepository.findOne({
        where: { department_id: departmentId },
        relations: ['library'],
      });

      return updatedDepartment;
    } catch (error) {
      throw new BadRequestException(
        `Failed to update Department: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันแก้ไข เพิ่มงบประมาณสาขา หักจากงบประมาณหอสมุด
  async facultyUpdate(
    departmentId: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    try {
      const department = await this.departmentRepository.findOne({
        where: { department_id: departmentId },
        relations: ['faculty'],
      });

      if (!department) {
        throw new NotFoundException(
          `Department with ID ${departmentId} not found`,
        );
      }

      if (!department.faculty) {
        throw new NotFoundException(
          `Faculty for Department ID ${departmentId} not found`,
        );
      }

      if (updateDepartmentDto.e_coupon === undefined) {
        throw new BadRequestException(`e_coupon is required`);
      }

      const eCouponDiff =
        updateDepartmentDto.e_coupon - (department.e_coupon || 0);

      const faculty = await this.facultyRepository
        .createQueryBuilder('faculty')
        .where('faculty.faculty_id = :facultyId', {
          facultyId: department.faculty.faculty_id,
        })
        .getOne();

      if (!faculty) {
        throw new NotFoundException(
          `Faculty with ID ${department.faculty.faculty_id} not found`,
        );
      }

      if (eCouponDiff > faculty.e_coupon) {
        throw new BadRequestException(`Not enough budget to allocate`);
      }

      department.e_coupon = updateDepartmentDto.e_coupon;
      faculty.e_coupon -= eCouponDiff;

      await this.departmentRepository.save(department);
      await this.facultyRepository.save(faculty);

      const updatedDepartment = await this.departmentRepository.findOne({
        where: { department_id: departmentId },
        relations: ['faculty'],
      });

      return updatedDepartment;
    } catch (error) {
      throw new BadRequestException(
        `Failed to update Department: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันลบ สาขา
  async remove(departmentId: number): Promise<Department> {
    try {
      const department = await this.departmentRepository.findOne({
        where: { department_id: departmentId },
      });
      if (!department) {
        throw new NotFoundException(
          `Department with ID ${departmentId} not found.`,
        );
      }
      const deletedDepartment = Object.assign(department, UpdateDepartmentDto);
      return this.departmentRepository.remove(deletedDepartment);
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete Department: ${error.message}`,
      );
    }
  }
}
