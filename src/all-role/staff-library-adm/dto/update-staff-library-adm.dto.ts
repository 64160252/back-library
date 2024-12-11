import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffLibraryAdmDto } from './create-staff-library-adm.dto';

export class UpdateStaffLibraryAdmDto extends PartialType(CreateStaffLibraryAdmDto) {}
