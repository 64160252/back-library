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

    const payload = {
      username: user.user_name,
      prefix: user.user_prefix,
      firstName: user.user_firstName,
      lastName: user.user_lastName,
      sub: user.user_id,
      role: user.role?.role_name,
      position_name: user.position_name,
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
      role: user.role.role_name,
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
