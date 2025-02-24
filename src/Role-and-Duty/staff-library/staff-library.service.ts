import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffLibrary } from './entities/staff-library.entity'; // Entity ของ StaffLibrary
import { CreateStaffLibraryDto } from './dto/create-staff-library.dto';
import { UpdateStaffLibraryDto } from './dto/update-staff-library.dto';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class StaffsLibraryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(StaffLibrary)
    private readonly staffLibraryRepository: Repository<StaffLibrary>,
  ) {}

  // ฟังก์ชันสร้าง ผู้ใช้งาน (บุคลากรหอสมุด)
  async create(
    createStaffLibraryDto: CreateStaffLibraryDto,
  ): Promise<StaffLibrary> {
    const {
      user_email,
      user_name,
      user_password,
      user_tel,
      user_prefix,
      user_firstName,
      user_lastName,
      duty_name,
      ...staffLibraryData
    } = createStaffLibraryDto;

    try {
      const role_id = 3;

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

      const staffLibrary = this.staffLibraryRepository.create({
        ...staffLibraryData,
        user: savedUser,
        user_prefix,
        user_firstName,
        user_lastName,
        duty_name,
      });

      return await this.staffLibraryRepository.save(staffLibrary);
    } catch (error) {
      if (error) {
        await this.userRepository.delete({
          user_name: createStaffLibraryDto.user_name,
        });
      }
      throw new BadRequestException(
        `StaffLibrary creation failed: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ทั้งหมด (บุคลากรหอสมุด)
  async findAll() {
    return await this.staffLibraryRepository
      .createQueryBuilder('staffLibrary')
      .leftJoinAndSelect('staffLibrary.user', 'user')
      .select([
        'staffLibrary.staffs_library_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .getMany();
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ตาม id (บุคลากรหอสมุด)
  async findOne(id: number) {
    return await this.staffLibraryRepository
      .createQueryBuilder('staffLibrary')
      .leftJoinAndSelect('staffLibrary.user', 'user')
      .select([
        'staffLibrary.staffs_library_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('staffLibrary.staffs_library_id = :id', { id })
      .getOne();
  }

  // ฟังก์ชันแก้ไข ผู้ใช้งาน (บุคลากรหอสมุด)
  async update(id: number, updateStaffLibraryDto: UpdateStaffLibraryDto) {
    const staffLibrary = await this.staffLibraryRepository.findOne({
      where: { staffs_library_id: id },
      relations: ['user'],
    });
    if (!staffLibrary) {
      throw new NotFoundException(`StaffLibrary with id ${id} not found`);
    }

    const updatedStaffLibrary = Object.assign(
      staffLibrary,
      updateStaffLibraryDto,
    );
    return this.staffLibraryRepository.save(updatedStaffLibrary);
  }

  // ฟังก์ชันลบ ผู้ใช้งาน (บุคลากรหอสมุด)
  async remove(id: number) {
    const staffLibrary = await this.staffLibraryRepository.findOne({
      where: { staffs_library_id: id },
      relations: ['user'],
    });
    if (!staffLibrary) {
      throw new NotFoundException(`StaffLibrary with id ${id} not found`);
    }
    return this.staffLibraryRepository.remove(staffLibrary);
  }
}
