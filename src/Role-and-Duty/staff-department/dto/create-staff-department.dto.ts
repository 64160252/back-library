import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStaffDepartmentDto {
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

  // ฟิลด์ที่เกี่ยวข้องกับ Staff Department
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
  @IsNotEmpty()
  user: number;
}
