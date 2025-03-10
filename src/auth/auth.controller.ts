import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UseGuards,
  Request
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // การ login และสร้าง access token กับ refresh token
  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(username, password);
  }

  // การ logout และลบ refresh token
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Request() req) {
    const userId = req.user.userId;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    await this.authService.logout(userId);
    return { message: 'Logged out successfully' };
  }

  // การใช้ refresh token เพื่อสร้าง access token ใหม่
  @Post('refresh')
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}