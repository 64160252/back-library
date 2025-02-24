import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Faculty } from 'src/faculties/entities/faculty.entity';
import { Teacher } from 'src/Role-and-Duty/teachers/entities/teacher.entity';
import { Library } from 'src/library/entities/library.entity';
import { Student } from 'src/Role-and-Duty/student/entities/student.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  department_id: number;

  @Column()
  department_name: string;

  @ManyToOne(() => Library, (library) => library.departments)
  @JoinColumn({ name: 'library_id' })
  library: Library;

  @ManyToOne(() => Faculty, (faculty) => faculty.departments)
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;

  @Column()
  faculty_name: string;

  @Column()
  e_coupon: number;

  @OneToMany(() => Teacher, (teachers) => teachers.department)
  teachers: Teacher[];

  @OneToMany(() => Student, (students) => students.department)
  students: Student[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
