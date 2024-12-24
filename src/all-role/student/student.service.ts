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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // เพิ่ม user หรือ properties อื่น ๆ ที่จำเป็น
    const student = this.studentRepository.create({
      ...createStudentDto, // รวมข้อมูลจาก DTO ที่ได้รับ
      user: { user_id: createStudentDto.user_id }, // ถ้าจำเป็นต้องเชื่อมโยงกับ User (ในกรณีนี้อาจเป็น ID)
      createdAt: new Date(), // เพิ่ม createdAt (หรือสามารถใช้ default value ได้ถ้ามีใน entity)
      updatedAt: new Date(), // เพิ่ม updatedAt (เช่นเดียวกัน)
    });

    return this.studentRepository.save(student);
  }

  async findAll() {
    return await this.studentRepository
      .createQueryBuilder('student') // เปลี่ยนเป็น 'student' แทน 'user'
      .leftJoinAndSelect('student.user', 'user') // เชื่อมโยง student กับ user
      .select([
        'student.student_id',
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
