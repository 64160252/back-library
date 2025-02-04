import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
  ) {}

  create(createBudgetDto: CreateBudgetDto) {
    const budget = this.budgetRepository.create(createBudgetDto);
    return this.budgetRepository.save(budget);
  }

  findAll() {
    return this.budgetRepository.find();
  }

  // แก้ไขที่ตรงนี้
  findOne(id: number) {
    return this.budgetRepository.findOne({ where: { budget_id: id } });
  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto) {
    await this.budgetRepository.update(id, updateBudgetDto);
    return this.budgetRepository.findOne({ where: { budget_id: id } });
  }

  async remove(id: number) {
    const budget = await this.budgetRepository.findOne({
      where: { budget_id: id },
    });
    return this.budgetRepository.softRemove(budget);
  }
}
