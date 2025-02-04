import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Column,
  Entity,
} from 'typeorm';

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn()
  budget_id: number;

  @Column()
  budget_amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
