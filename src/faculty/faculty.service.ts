import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faculty } from './entities/faculty.entity';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Department } from 'src/department/entities/department.entity';

@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  // สร้าง Faculty ใหม่
  async create(createFacultyDto: CreateFacultyDto): Promise<Faculty> {
    const faculty = this.facultyRepository.create(createFacultyDto); // สร้าง instance ของ Faculty
    return await this.facultyRepository.save(faculty); // บันทึกในฐานข้อมูล
  }

  async findAll() {
    return this.facultyRepository
      .createQueryBuilder('faculty')
      .leftJoinAndSelect('faculty.departments', 'department') // ต้องตรงกับชื่อใน Entity
      .leftJoinAndSelect('department.users', 'user') // เชื่อมโยง student กับ user
      .select([
        'faculty.faculty_id',
        'faculty.faculty_name',
        'department.department_id', // เลือกฟิลด์ department_id
        'department.department_name', // เลือกฟิลด์ department_name
        'user.user_id', // เลือกฟิลด์ user_id
        'user.user_name', // เลือกฟิลด์ user_name
        'user.user_prefix',
        'user.user_firstName',
        'user.user_lastName',
        'user.user_email', // เลือกฟิลด์ user_email
        'user.user_tel', // เลือกฟิลด์ user_tel
        'user.position_name',
        'user.management_position_name',
      ])
      .getMany();
  }
  
  async findOne(id: number) {
    return this.facultyRepository
      .createQueryBuilder('faculty')
      .leftJoinAndSelect('faculty.departments', 'department')
      .leftJoinAndSelect('department.users', 'user') // เชื่อมโยง student กับ user
      .select([
        'faculty.faculty_id',
        'faculty.faculty_name',
        'department.department_id', // เลือกฟิลด์ department_id
        'department.department_name', // เลือกฟิลด์ department_name
        'user.user_id', // เลือกฟิลด์ user_id
        'user.user_name', // เลือกฟิลด์ user_name
        'user.user_prefix',
        'user.user_firstName',
        'user.user_lastName',
        'user.user_email', // เลือกฟิลด์ user_email
        'user.user_tel', // เลือกฟิลด์ user_tel
        'user.position_name',
        'user.management_position_name',
      ])
      .where('faculty.faculty_id = :id', { id })
      .getOne();
  }  

  // อัปเดตข้อมูล Faculty
  async update(
    id: number,
    updateFacultyDto: UpdateFacultyDto,
  ): Promise<Faculty> {
    const faculty = await this.facultyRepository.findOne({
      where: { faculty_id: id },
      relations: ['users'],
    });

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }

    // อัปเดตข้อมูล faculty ด้วยข้อมูลใหม่จาก DTO
    const updatedFaculty = Object.assign(faculty, updateFacultyDto);
    return this.facultyRepository.save(updatedFaculty); // บันทึกข้อมูล
  }

  // ลบ Faculty
  async remove(id: number): Promise<void> {
    const faculty = await this.facultyRepository.findOne({
      where: { faculty_id: id },
      relations: ['users'],
    });

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }

    // ลบ Faculty
    await this.facultyRepository.remove(faculty);
  }
}
