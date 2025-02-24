import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStudentDto {
  // ฟิลด์ที่เกี่ยวข้องกับ User
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @IsString()
  @IsNotEmpty()
  user_password: string;

  @IsString()
  @IsNotEmpty()
  user_email: string;

  @IsString()
  @IsNotEmpty()
  user_tel: string;

  // ฟิลด์ที่เกี่ยวข้องกับ Student
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
  duty_name: string;

  @IsNumber()
  e_coupon: number;

  @IsNumber()
  @IsNotEmpty()
  user: number;

  @IsNumber()
  @IsNotEmpty()
  faculty: number;

  @IsNumber()
  @IsNotEmpty()
  department: number;
}
