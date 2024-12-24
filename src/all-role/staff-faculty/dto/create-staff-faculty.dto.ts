import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStaffFacultyDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number; // เชื่อมกับ User ID
}
