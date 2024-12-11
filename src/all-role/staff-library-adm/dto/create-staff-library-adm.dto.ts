import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStaffLibraryAdmDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number; // เชื่อมกับ User ID

  @IsNumber()
  @IsNotEmpty()
  faculty_id: number; // ใช้ ID ของ Faculty

  @IsNumber()
  @IsNotEmpty()
  department_id: number; // ใช้ ID ของ Department
}
