import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStaffLibraryNorDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number; // เชื่อมกับ User ID
}
