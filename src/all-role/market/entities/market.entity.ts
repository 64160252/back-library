import { OfferForm } from 'src/offer-form/entities/offer-form.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('markets')
export class Market {
  @PrimaryGeneratedColumn()
  market_id: number;

  @Column()
  market_name: string;

  @OneToOne(() => User) // เชื่อมกับ User
  @JoinColumn({ name: 'user_id' }) // เชื่อม Foreign Key
  user: User;

  @OneToMany(() => OfferForm, (OfferForm) => OfferForm.market)
  OfferForms: OfferForm[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
