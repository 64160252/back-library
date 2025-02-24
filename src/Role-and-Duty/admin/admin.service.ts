import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity'; // Entity ของ Admin
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  // ฟังก์ชันสร้าง ผู้ใช้งาน (แอดมิน)
  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const {
      user_email,
      user_name,
      user_password,
      user_tel,
      user_prefix,
      user_firstName,
      user_lastName,
      duty_name,
      ...adminData
    } = createAdminDto;

    try {
      const role_id = 2;

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

      const admin = this.adminRepository.create({
        ...adminData,
        user: savedUser,
        user_prefix,
        user_firstName,
        user_lastName,
        duty_name,
      });

      return await this.adminRepository.save(admin);
    } catch (error) {
      if (error) {
        await this.userRepository.delete({
          user_name: createAdminDto.user_name,
        });
      }
      throw new BadRequestException(`Admin creation failed: ${error.message}`);
    }
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ทั้งหมด (แอดมิน)
  async findAll() {
    return await this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.user', 'user')
      .select([
        'admin.admins_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .getMany();
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ตาม id (แอดมิน)
  async findOne(id: number) {
    return await this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.user', 'user')
      .select([
        'admin.admins_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('admin.admins_id = :id', { id })
      .getOne();
  }

  // ฟังก์ชันแก้ไข ผู้ใช้งาน (แอดมิน)
  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminRepository.findOne({
      where: { admins_id: id },
      relations: ['user'],
    });
    if (!admin) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }

    const updatedAdmin = Object.assign(admin, updateAdminDto);
    return this.adminRepository.save(updatedAdmin);
  }

  // ฟังก์ชันลบ ผู้ใช้งาน (แอดมิน)
  async remove(id: number) {
    const admin = await this.adminRepository.findOne({
      where: { admins_id: id },
      relations: ['user'],
    });
    if (!admin) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }
    return this.adminRepository.remove(admin);
  }
}
