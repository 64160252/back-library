import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity'; // เปลี่ยนจาก Student เป็น Teacher
import { CreateTeacherDto } from './dto/create-teacher.dto'; // เปลี่ยนจาก CreateStudentDto เป็น CreateTeacherDto
import { UpdateTeacherDto } from './dto/update-teacher.dto'; // เปลี่ยนจาก UpdateStudentDto เป็น UpdateTeacherDto
import { User } from 'src/users/entities/user.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Faculty } from 'src/faculties/entities/faculty.entity';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  // ฟังก์ชันสร้าง ผู้ใช้งาน (อาจารย์)
  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const {
      user_email,
      user_name,
      user_password,
      user_tel,
      user_prefix,
      user_firstName,
      user_lastName,
      duty_name,
      e_coupon,
      faculty,
      department,
      ...teacherData
    } = createTeacherDto;

    try {
      const role_id = 6;
      const role_offer = 'อาจารย์';

      const roleEntity = await this.roleRepository.findOne({
        where: { role_id },
      });

      const lastUser = await this.userRepository
        .createQueryBuilder('user')
        .where('user.user_id LIKE :pattern', { pattern: `${role_id}%` })
        .orderBy('user.user_id', 'DESC')
        .getOne();

      const newUserId = parseInt(
        `${role_id}${(
          (lastUser ? parseInt(lastUser.user_id.toString().slice(-5)) : 0) + 1
        )
          .toString()
          .padStart(5, '0')}`,
      );

      const hashedPassword = await bcrypt.hash(user_password, 10);

      const user = this.userRepository.create({
        user_id: newUserId,
        user_email,
        user_name,
        user_password: hashedPassword,
        user_tel,
        role: roleEntity,
        role_name: roleEntity.role_name,
      });
      const savedUser = await this.userRepository.save(user);

      const facultyEntity = await this.facultyRepository.findOne({
        where: { faculty_id: faculty },
      });

      const departmentEntity = await this.departmentRepository.findOne({
        where: { department_id: department },
      });

      const teacher = this.teacherRepository.create({
        ...teacherData,
        user: savedUser,
        user_prefix,
        user_firstName,
        user_lastName,
        role_offer: role_offer,
        duty_name,
        e_coupon,
        faculty: facultyEntity,
        faculty_name: facultyEntity.faculty_name,
        department: departmentEntity,
        department_name: departmentEntity.department_name,
      });

      return await this.teacherRepository.save(teacher);
    } catch (error) {
      if (error) {
        await this.userRepository.delete({
          user_name: createTeacherDto.user_name,
        });
      }
      throw new BadRequestException(
        `Teacher creation failed: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ทั้งหมด (อาจารย์)
  async findAll() {
    return await this.teacherRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .select([
        'teacher.teacher_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .getMany();
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ตาม id (อาจารย์)
  async findOne(id: number) {
    return await this.teacherRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .select([
        'teacher.teacher_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('teacher.teacher_id = :id', { id })
      .getOne();
  }

  // ฟังก์ชันแก้ไข ผู้ใช้งาน (อาจารย์)
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

  // ฟังก์ชันลบ ผู้ใช้งาน (อาจารย์)
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
