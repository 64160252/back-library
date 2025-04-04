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
  ) { }

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
  async findOne(id: number): Promise<Department> {
    return await this.departmentRepository
      .createQueryBuilder('department')
      .where('department.department_id = :id', { id })
      .getOne();
  }

  // ฟังก์ชันแก้ไข งบประมาณ
  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    try {
      const department = await this.departmentRepository.findOne({
        where: { department_id: id },
      });
      if (!department) {
        throw new NotFoundException(`Department with ID ${id} not found`);
      }
      const updatedDepartment = Object.assign(department, updateDepartmentDto);
      return this.departmentRepository.save(updatedDepartment);
    } catch (error) {
      throw new BadRequestException(
        `Failed to update Department: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันแก้ไข เพิ่มงบประมาณสาขา หักจากงบประมาณหอสมุด
  async libraryUpdate(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    try {
      const department = await this.departmentRepository.findOne({
        where: { department_id: id },
        relations: ['library'],
      });
  
      if (!department) {
        throw new NotFoundException(
          `Department with ID ${id} not found`,
        );
      }
  
      if (!department.library) {
        throw new NotFoundException(
          `Library for Department ID ${id} not found`,
        );
      }
  
      if (updateDepartmentDto.e_coupon === undefined || updateDepartmentDto.e_coupon === null) {
        throw new BadRequestException(`e_coupon is required`);
      }
  
      // ป้องกัน NULL ด้วยค่าเริ่มต้น
      const currentECoupon = department.e_coupon ?? 0;
      const currentBudgetRemain = department.library.budget_remain ?? 0;
      const currentBudgetUsed = department.library.budget_used ?? 0;
  
      const eCouponDiff = updateDepartmentDto.e_coupon - currentECoupon;
  
      if (eCouponDiff > currentBudgetRemain) {
        throw new BadRequestException(`Not enough budget to allocate`);
      }
  
      // อัปเดตค่าต่าง ๆ
      department.e_coupon = updateDepartmentDto.e_coupon;
      department.library.budget_remain = currentBudgetRemain - eCouponDiff;
      department.library.budget_used = currentBudgetUsed + eCouponDiff;
  
      await this.departmentRepository.save(department);
      await this.libraryRepository.save(department.library);
  
      const updatedDepartment = await this.departmentRepository.findOne({
        where: { department_id: id },
        relations: ['library'],
      });
  
      return updatedDepartment;
    } catch (error) {
      throw new BadRequestException(
        `Failed to update Department: ${error.message}`,
      );
    }
  }  

  // ฟังก์ชันแก้ไข เพิ่มงบประมาณสาขา หักจากงบประมาณคณะ
  async facultyUpdate(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    try {
      const department = await this.departmentRepository.findOne({
        where: { department_id: id },
        relations: ['faculty'],
      });

      if (!department) {
        throw new NotFoundException(
          `Department with ID ${id} not found`,
        );
      }

      if (!department.faculty) {
        throw new NotFoundException(
          `Faculty for Department ID ${id} not found`,
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
        where: { department_id: id },
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
  async remove(id: number): Promise<Department> {
    try {
      const department = await this.departmentRepository.findOne({
        where: { department_id: id },
      });
      if (!department) {
        throw new NotFoundException(
          `Department with ID ${id} not found.`,
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
