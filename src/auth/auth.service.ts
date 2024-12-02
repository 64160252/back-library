import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity'; // นำเข้า entity User

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // เชื่อมต่อ repository ของ User
  ) {}

  async validateUser(loginDto: { username: string; password: string }) {
    // ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await this.userRepository.findOne({
      where: { user_name: loginDto.username, user_password: loginDto.password },
    });

    if (user) {
      return { username: user.user_name, token: 'example-token' }; // สามารถเพิ่ม token จริงได้ภายหลัง
    }
    return null; // หากไม่พบผู้ใช้
  }
}
