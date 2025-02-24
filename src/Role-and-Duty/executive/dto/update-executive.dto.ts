import { PartialType } from '@nestjs/mapped-types';
import { CreateExecutiveDto } from './create-executive.dto';

export class UpdateExecutiveDto extends PartialType(CreateExecutiveDto) {}
