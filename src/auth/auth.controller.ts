import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

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

  // การใช้ refresh token เพื่อสร้าง access token ใหม่
  @Post('refresh')
  async refreshToken(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  // การ logout และลบ refresh token
  @Post('logout')
  async logout(@Body('user_id') userId: number) {
    return this.authService.logout(userId);
  }
}
