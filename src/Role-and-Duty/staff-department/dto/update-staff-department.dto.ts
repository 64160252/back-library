import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffDepartmentDto } from './create-staff-department.dto';

export class UpdateStaffDepartmentDto extends PartialType(
  CreateStaffDepartmentDto,
) {}
