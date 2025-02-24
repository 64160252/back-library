import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { User } from 'src/users/entities/user.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Faculty } from 'src/faculties/entities/faculty.entity';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  // ฟังก์ชันสร้าง ผู้ใช้งาน (นิสิต)
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
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
      ...studentData
    } = createStudentDto;

    try {
      const role_id = 7;
      const role_offer = 'นิสิต';

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

      const student = this.studentRepository.create({
        ...studentData,
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

      return await this.studentRepository.save(student);
    } catch (error) {
      if (error) {
        await this.userRepository.delete({
          user_name: createStudentDto.user_name,
        });
      }
      throw new BadRequestException(
        `Student creation failed: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ทั้งหมด (นิสิต)
  async findAll() {
    return await this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user')
      .select([
        'student.student_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .getMany();
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ตาม id (นิสิต)
  async findOne(id: number) {
    return await this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user')
      .select([
        'student.student_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('student.student_id = :id', { id })
      .getOne();
  }

  // ฟังก์ชันแก้ไข ผู้ใช้งาน (นิสิต)
  async update(id: number, updatetudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.findOne({
      where: { student_id: id },
      relations: ['user'],
    });
    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }

    const updatedstudent = Object.assign(student, updatetudentDto);
    return this.studentRepository.save(updatedstudent);
  }

  // ฟังก์ชันลบ ผู้ใช้งาน (นิสิต)
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
