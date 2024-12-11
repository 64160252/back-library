import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffFacultyDto } from './create-staff-faculty.dto';

export class UpdateStaffFacultyDto extends PartialType(CreateStaffFacultyDto) {}
