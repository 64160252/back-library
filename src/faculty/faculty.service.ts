import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faculty } from './entities/faculty.entity';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Student } from 'src/all-role/student/entities/student.entity';

@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>, // Repository ของ Faculty

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
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
      .leftJoinAndSelect('department.students', 'student') // ต้องตรงกับชื่อใน Entity
      .leftJoinAndSelect('student.user', 'user') // เชื่อมโยง student กับ user
      .select([
        'faculty.faculty_id',
        'faculty.faculty_name',
        'department.department_name',
        'student.student_id', // เลือกฟิลด์ student_id
        'user.user_id', // เลือกฟิลด์ user_id
        'user.user_name', // เลือกฟิลด์ user_name
        'user.user_email', // เลือกฟิลด์ user_email
        'user.user_tel', // เลือกฟิลด์ user_tel
      ])
      .getMany();
  }
  
  async findOne(id: number) {
    return this.facultyRepository
      .createQueryBuilder('faculty')
      .leftJoinAndSelect('faculty.departments', 'department')
      .leftJoinAndSelect('department.students', 'student')
      .leftJoinAndSelect('student.user', 'user') // เชื่อมโยง student กับ user
      .select([
        'faculty.faculty_id',
        'faculty.faculty_name',
        'department.department_name',
        'student.student_id', // เลือกฟิลด์ student_id
        'user.user_id', // เลือกฟิลด์ user_id
        'user.user_name', // เลือกฟิลด์ user_name
        'user.user_email', // เลือกฟิลด์ user_email
        'user.user_tel', // เลือกฟิลด์ user_tel
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
      relations: ['students'], // เพิ่มการเชื่อมโยงกับ students หากจำเป็น
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
      relations: ['students'], // เพิ่มการเชื่อมโยงกับ students หากจำเป็น
    });

    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${id} not found`);
    }

    // ลบ Faculty
    await this.facultyRepository.remove(faculty);
  }
}
