import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
} from 'typeorm';
import { Faculty } from 'src/faculties/entities/faculty.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Teacher } from 'src/Role-and-Duty/teachers/entities/teacher.entity';
import { OfferFormsOnl } from 'src/offer-forms-onl/entities/offer-forms-onl.entity';
import { OfferFormsOfl } from 'src/offer-forms-ofl/entities/offer-forms-ofl.entity';

@Entity('library')
export class Library {
  @PrimaryGeneratedColumn()
  library_id: number;

  @Column({ unique: true })
  budget_year: number;

  @Column()
  budget_amount: number;

  @Column({ default: 0 })
  budget_used: number;

  @Column()
  budget_remain: number;

  @OneToMany(() => Faculty, (faculties) => faculties.library)
  faculties: Faculty[];

  @OneToMany(() => Department, (departments) => departments.library)
  departments: Department[];

  @OneToMany(() => Teacher, (teachers) => teachers.library)
  teachers: Teacher[];

  @OneToMany(() => OfferFormsOnl, (offerFormsOnls) => offerFormsOnls.library)
  offerFormsOnls: OfferFormsOnl[];

  @OneToMany(() => OfferFormsOfl, (offerFormsOfls) => offerFormsOfls.library)
  offerFormsOfls: OfferFormsOfl[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
