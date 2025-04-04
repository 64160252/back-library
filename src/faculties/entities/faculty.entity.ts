import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Department } from 'src/departments/entities/department.entity';
import { Teacher } from 'src/Role-and-Duty/teachers/entities/teacher.entity';
import { Library } from 'src/library/entities/library.entity';
import { Student } from 'src/Role-and-Duty/student/entities/student.entity';
import { StaffFaculty } from 'src/Role-and-Duty/staff-faculty/entities/staff-faculty.entity';
import { OfferFormsOnl } from 'src/offer-forms-onl/entities/offer-forms-onl.entity';
import { OfferFormsOfl } from 'src/offer-forms-ofl/entities/offer-forms-ofl.entity';

@Entity('faculties')
export class Faculty {
  @PrimaryGeneratedColumn()
  faculty_id: number;

  @Column()
  faculty_name: string;

  @Column()
  e_coupon: number;

  @Column({ default: 0 })
  budget_count: number;

  @ManyToOne(() => Library, (library) => library.faculties)
  @JoinColumn({ name: 'library_id' })
  library: Library;

  @OneToMany(() => Department, (departments) => departments.faculty)
  departments: Department[];

  @OneToMany(() => StaffFaculty, (staffsFaculty) => staffsFaculty.faculty)
  staffsFaculty: StaffFaculty[];

  @OneToMany(() => Teacher, (teachers) => teachers.faculty)
  teachers: Teacher[];

  @OneToMany(() => Student, (students) => students.faculty)
  students: Student[];

  @OneToMany(() => OfferFormsOnl, (offerFormsOnls) => offerFormsOnls.faculty)
  offerFormsOnls: OfferFormsOnl[];

  @OneToMany(() => OfferFormsOfl, (offerFormsOfls) => offerFormsOfls.faculty)
  offerFormsOfls: OfferFormsOfl[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
