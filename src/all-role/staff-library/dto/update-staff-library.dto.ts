import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffLibraryDto } from './create-staff-library.dto';

export class UpdateStaffLibraryDto extends PartialType(CreateStaffLibraryDto) {}
