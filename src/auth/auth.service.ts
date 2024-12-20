import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // ตรวจสอบ username และ password
  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.user_password))) {
      return user;
    }
    return null;
  }

  // Login และสร้าง Access Token กับ Refresh Token
  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // ใช้ user_id ใน payload
    const payload = {
      username: user.user_name,
      sub: user.user_id, // ใช้ sub แทน user_id เพื่อให้ JWT นั้นมีการตั้งค่าที่ถูกต้อง
      role: user.role.role_name, // เพิ่ม role ของผู้ใช้
    };

    // สร้าง access token
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN, // ระยะเวลาใช้งาน access token
    });

    // สร้าง refresh token
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET, // ใช้ secret ที่แตกต่างจาก access token
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN, // ระยะเวลาใช้งาน refresh token
    });

    // บันทึก Refresh Token ลงในฐานข้อมูล
    await this.userService.updateRefreshToken(user.user_id, refresh_token);

    return { access_token, refresh_token };
  }

  // ฟังก์ชันสำหรับ refresh token และสร้าง access token ใหม่
  async refreshToken(refreshToken: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // สร้าง access token ใหม่จากข้อมูลใน refresh token
    const newAccessToken = this.jwtService.sign(
      { username: payload.username, sub: payload.sub, role: payload.role },
      { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return { access_token: newAccessToken };
  }

  // ฟังก์ชันในการ logout และลบ refresh token ออกจากฐานข้อมูล
  async logout(userId: number) {
    // ลบ refresh token ออกจากฐานข้อมูล
    await this.userService.removeRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }
}
