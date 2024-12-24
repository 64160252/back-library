import { Department } from 'src/department/entities/department.entity';
import { OfferForm } from 'src/offer-form/entities/offer-form.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('faculties')
export class Faculty {
  @PrimaryGeneratedColumn()
  faculty_id: number;

  @Column()
  faculty_name: string; // ชื่อคณะ (เก็บเป็นข้อความ)

  @OneToMany(() => User, (user) => user.faculty)
  users: User[]; // ชื่อคณะ (เก็บเป็นข้อความ)

  @OneToMany(() => OfferForm, (OfferForm) => OfferForm.faculty)
  OfferForms: OfferForm[];

  @OneToMany(() => Department, (department) => department.faculty)
  departments: Department[]; // ชื่อคณะ (เก็บเป็นข้อความ)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
  students: any;
}
