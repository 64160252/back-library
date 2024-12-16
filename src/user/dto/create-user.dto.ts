import { IsString, IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'; // ใช้ class-validator สำหรับการ validate ข้อมูล

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @IsEmail()
  @IsNotEmpty()
  user_email: string;

  @IsString()
  @IsNotEmpty()
  user_password: string;

  @IsString()
  @IsNotEmpty()
  user_tel: string;

  @IsOptional()
  faculty: string | number;

  @IsOptional()
  department: string | number;

  @IsNotEmpty()
  role: string | number;
}
