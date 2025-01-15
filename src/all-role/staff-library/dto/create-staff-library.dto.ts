import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStaffLibraryDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number; // เชื่อมกับ User ID

  // @IsString()
  // @IsNotEmpty()
  // user_prefix: string;

  // @IsString()
  // @IsNotEmpty()
  // user_firstName: string;

  // @IsString()
  // @IsNotEmpty()
  // user_lastName: string;

  // @IsOptional()
  // offer_position: string;

  // @IsOptional()
  // position_name: string;

  // @IsOptional()
  // management_position_name: string;
}
