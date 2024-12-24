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
    const user = await this.userService.findOneByUsername(username);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.user_password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  // Login และสร้าง Access Token กับ Refresh Token
  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // ใช้ user_id และ role ใน payload
    const payload = {
      username: user.user_name,
      sub: user.user_id, // ใช้ sub สำหรับ user_id
      role: user.role?.role_name, // เพิ่ม role
    };

    // สร้าง access token
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // สร้าง refresh token
    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    // บันทึก refresh token ในฐานข้อมูล
    await this.userService.updateRefreshToken(user.user_id, refresh_token);

    // ส่งค่ากลับที่มี access token, refresh token, และ role
    return {
      access_token,
      refresh_token,
      role: user.role.role_name,
    };
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
