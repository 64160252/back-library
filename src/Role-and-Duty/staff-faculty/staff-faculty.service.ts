import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffFaculty } from './entities/staff-faculty.entity';
import { CreateStaffFacultyDto } from './dto/create-staff-faculty.dto';
import { UpdateStaffFacultyDto } from './dto/update-staff-faculty.dto';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Faculty } from 'src/faculties/entities/faculty.entity';

@Injectable()
export class StaffsFacultyService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(StaffFaculty)
    private readonly staffFacultyRepository: Repository<StaffFaculty>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) { }

  // ฟังก์ชันสร้าง ผู้ใช้งาน (บุคลากรคณะ)
  async create(
    createStaffFacultyDto: CreateStaffFacultyDto,
  ): Promise<StaffFaculty> {
    const {
      user_email,
      user_name,
      user_password,
      user_tel,
      user_prefix,
      user_firstName,
      user_lastName,
      duty_name,
      faculty,
      department,
      ...staffFacultyData
    } = createStaffFacultyDto;

    try {
      const role_id = 4;

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
        where: {
          department_id: department,
          faculty: { faculty_id: faculty },
        },
      });

      const staffFaculty = this.staffFacultyRepository.create({
        ...staffFacultyData,
        user: savedUser,
        user_prefix,
        user_firstName,
        user_lastName,
        duty_name,
        faculty: facultyEntity,
        faculty_name: facultyEntity.faculty_name,
        department: departmentEntity,
        department_name: departmentEntity.department_name,
      });

      return await this.staffFacultyRepository.save(staffFaculty);
    } catch (error) {
      if (error) {
        await this.userRepository.delete({
          user_name: createStaffFacultyDto.user_name,
        });
      }
      throw new BadRequestException(
        `StaffFaculty creation failed: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ทั้งหมด (บุคลากรคณะ)
  async findAll() {
    return await this.staffFacultyRepository
      .createQueryBuilder('staffFaculty')
      .leftJoinAndSelect('staffFaculty.user', 'user')
      .select([
        'staffFaculty.staffs_faculty_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .getMany();
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ตาม id (บุคลากรคณะ)
  async findOne(id: number) {
    return await this.staffFacultyRepository
      .createQueryBuilder('staffFaculty')
      .leftJoinAndSelect('staffFaculty.user', 'user')
      .select([
        'staffFaculty.staffs_faculty_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('staffFaculty.staffs_faculty_id = :id', { id })
      .getOne();
  }

  // ฟังก์ชันแก้ไข ผู้ใช้งาน (บุคลากรคณะ)
  async update(id: number, updateStaffFacultyDto: UpdateStaffFacultyDto) {
    const staffFaculty = await this.staffFacultyRepository.findOne({
      where: { staffs_faculty_id: id },
      relations: ['user'],
    });
    if (!staffFaculty) {
      throw new NotFoundException(`StaffFaculty with id ${id} not found`);
    }

    const updatedStaffFaculty = Object.assign(
      staffFaculty,
      updateStaffFacultyDto,
    );
    return this.staffFacultyRepository.save(updatedStaffFaculty);
  }

  // ฟังก์ชันลบ ผู้ใช้งาน (บุคลากรคณะ)
  async remove(id: number) {
    const staffFaculty = await this.staffFacultyRepository.findOne({
      where: { staffs_faculty_id: id },
      relations: ['user'],
    });
    if (!staffFaculty) {
      throw new NotFoundException(`StaffFaculty with id ${id} not found`);
    }
    return this.staffFacultyRepository.remove(staffFaculty);
  }
}
