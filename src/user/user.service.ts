import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/role/entities/role.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { role_id, user_password, ...userData } = createUserDto;

    // ตรวจสอบว่า role_id ถูกส่งมาหรือไม่
    if (!role_id) {
      throw new Error('role_id is required'); // หากไม่มี role_id ให้ส่ง error กลับ
    }

    // ตรวจสอบว่า role_id มีอยู่จริงในฐานข้อมูลหรือไม่
    const role = await this.roleRepository.findOneBy({ role_id });
    if (!role) {
      throw new Error(`Role with ID ${role_id} not found`);
    }

    // แฮชรหัสผ่านก่อนบันทึก
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // สร้าง user โดยใช้ข้อมูลที่ได้รับและเพิ่ม role
    const user = this.userRepository.create({
      ...userData,
      role,
      user_password: hashedPassword,
    });

    return this.userRepository.save(user); // บันทึกผู้ใช้ที่มีรหัสผ่านที่แฮชแล้ว
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

  // ตรวจสอบว่าผู้ใช้ถูกดึงออกมาจากฐานข้อมูลถูกต้อง
  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.user_name = :username', { username })
      .getOne();

    console.log(user); // เพิ่ม log เพื่อตรวจสอบว่าได้ผู้ใช้ที่ถูกต้องหรือไม่
    return user;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (user) {
      user.refresh_token = refreshToken;
      await this.userRepository.save(user);
    }
  }

  // ฟังก์ชันในการลบ refresh token
  async removeRefreshToken(userId: number) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (user) {
      user.refresh_token = null; // ลบค่า refresh_token
      await this.userRepository.save(user);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { role_id, user_password, ...userData } = updateUserDto;

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

    // หากมีการส่งรหัสผ่านใหม่มา ต้องแฮชรหัสผ่านก่อนอัปเดต
    if (user_password) {
      user.user_password = await bcrypt.hash(user_password, 10);
    }

    Object.assign(user, userData); // อัปเดตข้อมูลที่เหลือ
    return this.userRepository.save(user); // บันทึกผู้ใช้ที่อัปเดต
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
