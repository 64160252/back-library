import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateExecutiveDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number; // เชื่อมกับ User ID
}
