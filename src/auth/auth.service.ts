import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.user_password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
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

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const userId = Number(user.user_id);
    if (isNaN(userId)) {
      throw new UnauthorizedException('Invalid user ID');
    }

    const payload = {
      sub: userId,
      email: user.user_email,
      username: user.user_name,
      tel: user.user_tel,
      role: user.role?.role_name,
      teacher:
        user.role?.role_name === 'Teacher'
          ? {
              user_prefix: user.teacher?.user_prefix,
              user_firstName: user.teacher?.user_firstName,
              user_lastName: user.teacher?.user_lastName,
              duty_name: user.teacher?.duty_name,
            }
          : null,
      student:
        user.role?.role_name === 'Student'
          ? {
              user_prefix: user.student?.user_prefix,
              user_firstName: user.student?.user_firstName,
              user_lastName: user.student?.user_lastName,
              duty_name: user.student?.duty_name,
            }
          : null,
    };
    console.log('Payload to be signed:', payload);

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    await this.usersService.createRefreshToken(user.user_id, refresh_token);

    return {
      access_token,
      refresh_token,
      role: user.role.role_name,
    };
  }

  async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }
}
