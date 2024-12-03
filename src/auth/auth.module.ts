import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';  // นำเข้า ConfigModule

@Module({
  imports: [
    ConfigModule.forRoot(),  // ใช้เพื่อโหลดไฟล์ .env
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,  // ดึงค่า JWT_SECRET จากไฟล์ .env
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },  // ดึงค่า JWT_EXPIRES_IN จากไฟล์ .env
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
