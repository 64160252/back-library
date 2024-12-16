import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity'; // เปลี่ยนจาก Student เป็น Teacher
import { CreateTeacherDto } from './dto/create-teacher.dto'; // เปลี่ยนจาก CreateStudentDto เป็น CreateTeacherDto
import { UpdateTeacherDto } from './dto/update-teacher.dto'; // เปลี่ยนจาก UpdateStudentDto เป็น UpdateTeacherDto
import { User } from 'src/user/entities/user.entity';
import { Student } from '../student/entities/student.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>, // เปลี่ยนจาก studentRepository เป็น teacherRepository
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  // สร้าง teacher
  // async create(createTeacherDto: CreateTeacherDto) {
  //   const { user_id } = createTeacherDto;

  //   // ตรวจสอบว่า User มีอยู่หรือไม่
  //   const user = await this.userRepository.findOne({ where: { user_id } });
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   // ตรวจสอบว่า User เชื่อมโยงกับ Student หรือ Teacher แล้วหรือไม่
  //   const existingStudent = await this.studentRepository.findOne({
  //     where: { user: { user_id } },
  //   });

  //   const existingTeacher = await this.teacherRepository.findOne({
  //     where: { user: { user_id } },
  //   });

  //   if (existingStudent) {
  //     throw new BadRequestException('This user is already linked to a Student');
  //   }

  //   if (existingTeacher) {
  //     throw new BadRequestException('This user is already linked to a Teacher');
  //   }

  //   // ถ้าไม่มีการเชื่อมโยงใด ๆ ก็สร้าง Teacher ใหม่
  //   const teacher = this.teacherRepository.create({
  //     user,
  //   });

  //   return await this.teacherRepository.save(teacher);
  // }

  // หา teacher ทั้งหมด
  async findAll() {
    return await this.teacherRepository
      .createQueryBuilder('teacher') // เปลี่ยนจาก 'student' เป็น 'teacher'
      .leftJoinAndSelect('teacher.user', 'user') // เปลี่ยนจาก 'student.user' เป็น 'teacher.user'
      .select([
        'teacher.teacher_id', // เปลี่ยนจาก 'student_id' เป็น 'teacher_id'
        'teacher.faculty',
        'teacher.department',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .getMany();
  }

  // หา teacher โดย id
  async findOne(id: number) {
    return await this.teacherRepository
      .createQueryBuilder('teacher') // เปลี่ยนจาก 'student' เป็น 'teacher'
      .leftJoinAndSelect('teacher.user', 'user') // เปลี่ยนจาก 'student.user' เป็น 'teacher.user'
      .select([
        'teacher.teacher_id', // เปลี่ยนจาก 'student_id' เป็น 'teacher_id'
        'teacher.faculty',
        'teacher.department',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('teacher.teacher_id = :id', { id }) // เปลี่ยนจาก 'student.student_id' เป็น 'teacher.teacher_id'
      .getOne();
  }

  // อัปเดตข้อมูล teacher
  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.teacherRepository.findOne({
      where: { teacher_id: id },
      relations: ['user'],
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }

    const updatedTeacher = Object.assign(teacher, updateTeacherDto);
    return this.teacherRepository.save(updatedTeacher);
  }

  // ลบ teacher
  async remove(id: number) {
    const teacher = await this.teacherRepository.findOne({
      where: { teacher_id: id },
      relations: ['user'],
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with id ${id} not found`);
    }
    return this.teacherRepository.remove(teacher);
  }
}
