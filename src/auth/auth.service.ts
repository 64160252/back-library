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

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
  
    // แปลง user_id ให้เป็นตัวเลขก่อนใช้ใน payload.sub
    const userId = Number(user.user_id);
    if (isNaN(userId)) {
      throw new UnauthorizedException('Invalid user ID');
    }
  
    const payload = {
      sub: userId,
      username: user.user_name,
      prefix: user.user_prefix,
      firstName: user.user_firstName,
      lastName: user.user_lastName,
      offer_position: user.offer_position,
      position_name: user.position_name,
      management_position_name: user.management_position_name,
      store_name: user.store_name,
      role: user.role?.role_name,
      faculty: user.faculty?.faculty_name || null, // เพิ่ม fallback เป็น null
      department: user.department?.department_name || null, // เพิ่ม fallback เป็น null
      tel: user.user_tel,
      email: user.user_email,
    };
    console.log(payload);
  
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
  
    // อัพเดท refresh token ในฐานข้อมูล
    await this.userService.updateRefreshToken(user.user_id, refresh_token);
  
    return {
      access_token,
      refresh_token,
      role: user.role?.role_name || null,
      faculty: user.faculty?.faculty_name || null,
      department: user.department?.department_name || null,
    };
  }  

  async refreshToken(refreshToken: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const newAccessToken = this.jwtService.sign(
      { username: payload.username, sub: payload.sub, role: payload.role },
      { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return { access_token: newAccessToken };
  }

  async logout(userId: number) {
    await this.userService.removeRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }
}
