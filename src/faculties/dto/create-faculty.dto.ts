import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFacultyDto {
  @IsString()
  @IsNotEmpty()
  faculty_name: string;

  @IsNumber()
  e_coupon: number;
}
