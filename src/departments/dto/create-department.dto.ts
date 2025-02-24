import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  department_name: string;
  department_names: string[]

  @IsNumber()
  @IsNotEmpty()
  faculty: number; 

  @IsNumber()
  e_coupon: number;
}
