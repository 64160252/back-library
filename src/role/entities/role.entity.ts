import { OfferForm } from 'src/offer-form/entities/offer-form.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ unique: true })
  role_name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @OneToMany(() => OfferForm, (OfferForm) => OfferForm.role)
  OfferForms: OfferForm[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
