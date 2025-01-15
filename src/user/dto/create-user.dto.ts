import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator'; // ใช้ class-validator สำหรับการ validate ข้อมูล

export class CreateUserDto {
  @IsString()
  @IsOptional()
  user_prefix: string;

  @IsString()
  @IsOptional()
  user_firstName: string;

  @IsString()
  @IsOptional()
  user_lastName: string;

  @IsOptional()
  offer_position: string;

  @IsOptional()
  position_name: string;

  @IsOptional()
  management_position_name: string;

  @IsOptional()
  store_name: string;

  @IsString()
  @IsNotEmpty()
  user_name: string;

  @IsEmail()
  @IsOptional()
  user_email: string;

  @IsString()
  @IsNotEmpty()
  user_password: string;

  @IsString()
  @IsOptional()
  user_tel: string;

  @IsOptional()
  faculty: string | number;

  @IsOptional()
  department: string | number;

  @IsNotEmpty()
  role: string | number;
}
