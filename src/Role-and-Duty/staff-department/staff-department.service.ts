import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateStaffDepartmentDto } from './dto/create-staff-department.dto';
import { UpdateStaffDepartmentDto } from './dto/update-staff-department.dto';
import { StaffDepartment } from './entities/staff-department.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class StaffsDepartmentService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(StaffDepartment)
    private readonly staffDepartmentRepository: Repository<StaffDepartment>,
  ) {}

  // ฟังก์ชันสร้าง ผู้ใช้งาน (บุคลากรสาขา)
  async create(
    createStaffDepartmentDto: CreateStaffDepartmentDto,
  ): Promise<StaffDepartment> {
    const {
      user_email,
      user_name,
      user_password,
      user_tel,
      user_prefix,
      user_firstName,
      user_lastName,
      duty_name,
      ...staffDepartmentData
    } = createStaffDepartmentDto;

    try {
      const role_id = 5;

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

      const staffDepartment = this.staffDepartmentRepository.create({
        ...staffDepartmentData,
        user: savedUser,
        user_prefix,
        user_firstName,
        user_lastName,
        duty_name,
      });

      return await this.staffDepartmentRepository.save(staffDepartment);
    } catch (error) {
      if (error) {
        await this.userRepository.delete({
          user_name: createStaffDepartmentDto.user_name,
        });
      }
      throw new BadRequestException(
        `StaffDepartment creation failed: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ทั้งหมด (บุคลากรสาขา)
  async findAll() {
    return await this.staffDepartmentRepository
      .createQueryBuilder('staffDepartment')
      .leftJoinAndSelect('staffDepartment.user', 'user')
      .select([
        'staffDepartment.staffs_department_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .getMany();
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ตาม id (บุคลากรสาขา)
  async findOne(id: number) {
    return await this.staffDepartmentRepository
      .createQueryBuilder('staffDepartment')
      .leftJoinAndSelect('staffDepartment.user', 'user')
      .select([
        'staffDepartment.staffs_department_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('staffDepartment.staffs_department_id = :id', { id })
      .getOne();
  }

  // ฟังก์ชันแก้ไข ผู้ใช้งาน (บุคลากรสาขา)
  async update(id: number, updateStaffDepartmentDto: UpdateStaffDepartmentDto) {
    const staffDepartment = await this.staffDepartmentRepository.findOne({
      where: { staffs_department_id: id },
      relations: ['user'],
    });
    if (!staffDepartment) {
      throw new NotFoundException(`StaffDepartment with id ${id} not found`);
    }

    const updatedStaffDepartment = Object.assign(
      staffDepartment,
      updateStaffDepartmentDto,
    );
    return this.staffDepartmentRepository.save(updatedStaffDepartment);
  }

  // ฟังก์ชันลบ ผู้ใช้งาน (บุคลากรสาขา)
  async remove(id: number) {
    const staffDepartment = await this.staffDepartmentRepository.findOne({
      where: { staffs_department_id: id },
      relations: ['user'],
    });
    if (!staffDepartment) {
      throw new NotFoundException(`StaffDepartment with id ${id} not found`);
    }
    return this.staffDepartmentRepository.remove(staffDepartment);
  }
}
