import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { role_id, ...userData } = createUserDto;

    // ตรวจสอบว่า role_id ถูกส่งมาหรือไม่
    if (!role_id) {
      throw new Error('role_id is required'); // หากไม่มี role_id ให้ส่ง error กลับ
    }

    // ตรวจสอบว่า role_id มีอยู่จริงในฐานข้อมูลหรือไม่
    const role = await this.roleRepository.findOneBy({ role_id });
    if (!role) {
      throw new Error(`Role with ID ${role_id} not found`);
    }

    const user = this.userRepository.create({ ...userData, role });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .select([
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
        'role.role_id',
        'role.role_name',
      ])
      .getMany();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .select([
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
        'role.role_id',
        'role.role_name',
      ])
      .where('user.user_id = :id', { id })
      .getOne();
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { role_id, ...userData } = updateUserDto;

    const user = await this.findOne(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    if (role_id) {
      // ตรวจสอบ role_id ใหม่หากมีการส่งมา
      const role = await this.roleRepository.findOneBy({ role_id });
      if (!role) {
        throw new Error('Role not found');
      }
      user.role = role;
    }

    Object.assign(user, userData); // อัปเดตข้อมูลที่เหลือ
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
