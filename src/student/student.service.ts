import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // ใช้ Repository ของ User
  ) {}

  // สร้าง student
  async create(createStudentDto: CreateStudentDto) {
    // ค้นหาข้อมูล user ที่มี user_id ที่ตรงกับที่ได้รับมา
    const user = await this.userRepository.findOne({
      where: { user_id: createStudentDto.user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // สร้าง student ด้วยข้อมูลที่ได้รับมา
    const student = this.studentRepository.create({
      user, // เชื่อมโยงกับ user
    });

    // บันทึกข้อมูล student ใน database
    return await this.studentRepository.save(student);
  }

  async findAll() {
    return await this.studentRepository
      .createQueryBuilder('student') // เปลี่ยนเป็น 'student' แทน 'user'
      .leftJoinAndSelect('student.user', 'user') // เชื่อมโยง student กับ user
      .select([
        'student.student_id',
        'student.faculty',
        'student.department',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .getMany();
  }

  async findOne(id: number) {
    return await this.studentRepository
      .createQueryBuilder('student') // เปลี่ยนเป็น 'student' แทน 'user'
      .leftJoinAndSelect('student.user', 'user') // เชื่อมโยง student กับ user
      .select([
        'student.student_id',
        'student.faculty',
        'student.department',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('student.student_id = :id', { id }) // กำหนดเงื่อนไขการค้นหาด้วย student_id
      .getOne();
  }

  // อัปเดตข้อมูล student
  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.findOne({
      where: { student_id: id },
      relations: ['user'],
    });
    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }

    // อัปเดตข้อมูล student ด้วยข้อมูลใหม่จาก DTO
    const updatedStudent = Object.assign(student, updateStudentDto);
    return this.studentRepository.save(updatedStudent);
  }

  // ลบ student
  async remove(id: number) {
    const student = await this.studentRepository.findOne({
      where: { student_id: id },
      relations: ['user'],
    });
    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }
    return this.studentRepository.remove(student);
  }
}
