import { IsString, IsNotEmpty } from 'class-validator';
import { Faculty } from 'src/faculty/entities/faculty.entity';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  department_name: string;

  @IsString()
  @IsNotEmpty()
  faculty: Faculty; 
}
