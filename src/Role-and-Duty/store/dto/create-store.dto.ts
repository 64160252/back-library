import { IsNotEmpty, IsString } from 'class-validator'; // ใช้ class-validator สำหรับการ validate ข้อมูล

export class CreateStoreDto {
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

  // ฟิลด์ที่เกี่ยวข้องกับ Store
  @IsString()
  @IsNotEmpty()
  store_name: string;
}
