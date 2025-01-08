import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator'; // ใช้ class-validator สำหรับการ validate ข้อมูล

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  user_prefix: string;

  @IsString()
  @IsNotEmpty()
  user_firstName: string;

  @IsString()
  @IsNotEmpty()
  user_lastName: string;

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

  @IsOptional()
  position_name: string;

  @IsOptional()
  management_position_name: string;

  @IsNotEmpty()
  role: string | number;
}
