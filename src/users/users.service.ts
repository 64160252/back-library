import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // ฟังก์ชันสร้าง ผู้ใช้งาน
  async create(createUserDto: CreateUserDto): Promise<User> {
    const {
      user_email,
      user_name,
      user_password,
      user_tel,
      role,
      ...userData
    } = createUserDto;
    try {
      const roleEntity = await this.roleRepository.findOne({
        where: { role_id: role },
      });

      const role_id = roleEntity.role_id;

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
        ...userData,
        user_id: newUserId,
        user_email,
        user_name,
        user_password: hashedPassword,
        user_tel,
        role: roleEntity,
        role_name: roleEntity.role_name,
      });
      const savedUser = await this.userRepository.save(user);
      return savedUser;
    } catch (error) {
      throw new BadRequestException(`User creation failed: ${error.message}`);
    }
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ทั้งหมด
  async findAll(): Promise<User[]> {
    return await this.userRepository.createQueryBuilder('user').getMany();
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ตาม id
  async findOne(id: number): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.user_id = :id', { id })
      .getOne();
  }

  // ฟังก์ชันแก้ไข ผู้ใช้งาน
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: id },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      const updatedUser = Object.assign(user, updateUserDto);
      return this.userRepository.save(updatedUser);
    } catch (error) {
      throw new BadRequestException(`Failed to update user: ${error.message}`);
    }
  }

  // ฟังก์ชันลบ ผู้ใช้งาน
  async remove(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: id },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }
      const deletedUser = Object.assign(user, UpdateUserDto);
      return this.userRepository.remove(deletedUser);
    } catch (error) {
      throw new BadRequestException(`Failed to delete user: ${error.message}`);
    }
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน สำหรับ login
  async findOneByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { user_name: username },
      relations: ['role', 'teacher', 'student'],
    });
  }

  // ฟังก์ชันสร้าง refresh token สำหรับ login
  async createRefreshToken(id: number, refreshToken: string): Promise<void> {
    await this.userRepository.update(id, { refresh_token: refreshToken });
  }

  // ฟังก์ชันลบ refresh token สำหรับ logout
  async removeRefreshToken(id: number): Promise<void> {
    await this.userRepository.update(id, { refresh_token: null });
  }

  // ฟังก์ชันค้นหา ตำแหน่ง
  private async findRole(role: number | string): Promise<Role> {
    const roleEntity =
      typeof role === 'number'
        ? await this.roleRepository.findOne({ where: { role_id: role } })
        : await this.roleRepository.findOne({ where: { role_name: role } });

    if (!roleEntity) {
      throw new BadRequestException(
        `Role not found with ${typeof role === 'number' ? 'ID' : 'name'}: ${role}`,
      );
    }
    return roleEntity;
  }
}
