import { PartialType } from '@nestjs/mapped-types';
import { CreateBookfairDateDto } from './create-bookfair-date.dto';

export class UpdateBookfairDateDto extends PartialType(CreateBookfairDateDto) {}
