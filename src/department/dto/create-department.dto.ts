import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  department_name: string;

  @IsNumber()
  @IsNotEmpty()
  faculty: number; 
}
