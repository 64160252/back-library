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
import { Library } from 'src/library/entities/library.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Library)
    private readonly libraryRepository: Repository<Library>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) { }

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
      library,
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

      const libraryEntity = await this.libraryRepository.findOne({
        where: { library_id: library },
      });

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
        e_coupon: createTeacherDto.e_coupon ?? 0,
        library: libraryEntity,
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
        'teacher.user_prefix',
        'teacher.user_firstName',
        'teacher.user_lastName',
        'teacher.e_coupon',
        'teacher.faculty_name',
        'teacher.department_name',
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
        'teacher.user_prefix',
        'teacher.user_firstName',
        'teacher.user_lastName',
        'teacher.e_coupon',
        'teacher.faculty_name',
        'teacher.department_name',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('teacher.teacher_id = :id', { id })
      .getOne();
  }

  // ฟังก์ชันแก้ไข คูปอง
    async update(
      id: number,
      updateTeacherDto: UpdateTeacherDto,
    ): Promise<Teacher> {
      try {
        const teacher = await this.teacherRepository.findOne({
          where: { teacher_id: id },
        });
        if (!teacher) {
          throw new NotFoundException(`Teacher with ID ${id} not found`);
        }
        const updatedTeacher = Object.assign(teacher, updateTeacherDto);
        return this.teacherRepository.save(updatedTeacher);
      } catch (error) {
        throw new BadRequestException(
          `Failed to update Teacher: ${error.message}`,
        );
      }
    }

  // ฟังก์ชันแก้ไข เพิ่มคูปอง หักจากงบประมาณหอสมุด
  async libraryUpdate(
    id: number, updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    try {
      const teacher = await this.teacherRepository.findOne({
        where: { teacher_id: id },
        relations: ['library'],
      });
  
      if (!teacher) {
        throw new NotFoundException(
          `Teacher with ID ${id} not found`,
        );
      }
  
      if (!teacher.library) {
        throw new NotFoundException(
          `Library for Teacher ID ${id} not found`,
        );
      }
  
      if (updateTeacherDto.e_coupon === undefined || updateTeacherDto.e_coupon === null) {
        throw new BadRequestException(`e_coupon is required`);
      }
  
      // ป้องกัน NULL ด้วยค่าเริ่มต้น
      const currentECoupon = teacher.e_coupon ?? 0;
      const currentBudgetRemain = teacher.library.budget_remain ?? 0;
      const currentBudgetUsed = teacher.library.budget_used ?? 0;
  
      const eCouponDiff = updateTeacherDto.e_coupon - currentECoupon;
  
      if (eCouponDiff > currentBudgetRemain) {
        throw new BadRequestException(`Not enough budget to allocate`);
      }
  
      // อัปเดตค่าต่าง ๆ
      teacher.e_coupon = updateTeacherDto.e_coupon;
      teacher.library.budget_remain = currentBudgetRemain - eCouponDiff;
      teacher.library.budget_used = currentBudgetUsed + eCouponDiff;
  
      await this.teacherRepository.save(teacher);
      await this.libraryRepository.save(teacher.library);
  
      const updatedTeacher = await this.teacherRepository.findOne({
        where: { teacher_id: id },
        relations: ['library'],
      });
  
      return updatedTeacher;
    } catch (error) {
      throw new BadRequestException(
        `Failed to update Teacher: ${error.message}`,
      );
    }
  }  

  // ฟังก์ชันแก้ไข เพิ่มคูปอง หักจากงบประมาณคณะ
  async facultyUpdate(
    id: number,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    try {
      const teacher = await this.teacherRepository.findOne({
        where: { teacher_id: id },
        relations: ['faculty'],
      });

      if (!teacher) {
        throw new NotFoundException(
          `Teacher with ID ${id} not found`,
        );
      }

      if (!teacher.faculty) {
        throw new NotFoundException(
          `Faculty for Teacher ID ${id} not found`,
        );
      }

      if (updateTeacherDto.e_coupon === undefined) {
        throw new BadRequestException(`e_coupon is required`);
      }

      const eCouponDiff =
        updateTeacherDto.e_coupon - (teacher.e_coupon || 0);

      const faculty = await this.facultyRepository
        .createQueryBuilder('faculty')
        .where('faculty.faculty_id = :facultyId', {
          facultyId: teacher.faculty.faculty_id,
        })
        .getOne();

      if (!faculty) {
        throw new NotFoundException(
          `Faculty with ID ${teacher.faculty.faculty_id} not found`,
        );
      }

      if (eCouponDiff > faculty.e_coupon) {
        throw new BadRequestException(`Not enough budget to allocate`);
      }

      teacher.e_coupon = updateTeacherDto.e_coupon;
      faculty.e_coupon -= eCouponDiff;

      await this.teacherRepository.save(teacher);
      await this.facultyRepository.save(faculty);

      const updatedTeacher = await this.teacherRepository.findOne({
        where: { teacher_id: id },
        relations: ['faculty'],
      });

      return updatedTeacher;
    } catch (error) {
      throw new BadRequestException(
        `Failed to update Teacher: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันแก้ไข เพิ่มคูปอง หักจากงบประมาณสาขา
  async departmentUpdate(
    id: number,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    try {
      const teacher = await this.teacherRepository.findOne({
        where: { teacher_id: id },
        relations: ['department'],
      });

      if (!teacher) {
        throw new NotFoundException(
          `Teacher with ID ${id} not found`,
        );
      }

      if (!teacher.department) {
        throw new NotFoundException(
          `Department for Teacher ID ${id} not found`,
        );
      }

      if (updateTeacherDto.e_coupon === undefined) {
        throw new BadRequestException(`e_coupon is required`);
      }

      const eCouponDiff =
        updateTeacherDto.e_coupon - (teacher.e_coupon || 0);

      const department = await this.departmentRepository
        .createQueryBuilder('department')
        .where('department.department_id = :departmentId', {
          departmentId: teacher.department.department_id,
        })
        .getOne();

      if (!department) {
        throw new NotFoundException(
          `Department with ID ${teacher.department.department_id} not found`,
        );
      }

      if (eCouponDiff > department.e_coupon) {
        throw new BadRequestException(`Not enough budget to allocate`);
      }

      teacher.e_coupon = updateTeacherDto.e_coupon;
      department.e_coupon -= eCouponDiff;

      await this.teacherRepository.save(teacher);
      await this.departmentRepository.save(department);

      const updatedTeacher = await this.teacherRepository.findOne({
        where: { teacher_id: id },
        relations: ['department'],
      });

      return updatedTeacher;
    } catch (error) {
      throw new BadRequestException(
        `Failed to update Teacher: ${error.message}`,
      );
    }
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
