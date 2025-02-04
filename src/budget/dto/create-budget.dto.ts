import { IsNumber } from 'class-validator';

export class CreateBudgetDto {
  @IsNumber()
  budget_amount: number;
}
