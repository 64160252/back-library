import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLibraryDto {
  @IsNumber()
  @IsNotEmpty()
  budget_amount: number;
}
