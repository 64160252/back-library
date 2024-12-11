import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffLibraryNorDto } from './create-staff-library-nor.dto';

export class UpdateStaffLibraryNorDto extends PartialType(CreateStaffLibraryNorDto) {}
