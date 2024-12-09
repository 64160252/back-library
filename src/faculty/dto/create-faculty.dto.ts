import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFacultyDto {
  @IsString()
  @IsNotEmpty()
  faculty_name: string;
}
