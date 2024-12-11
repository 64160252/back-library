import { IsNotEmpty, IsNumber } from 'class-validator'; // ใช้ class-validator สำหรับการ validate ข้อมูล

export class CreateMarketDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number; // เชื่อมกับ User ID
}
