import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Department } from 'src/departments/entities/department.entity';
import { Faculty } from 'src/faculties/entities/faculty.entity';
import { Library } from 'src/library/entities/library.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  teacher_id: number;

  @Column({ default: null, nullable: true })
  user_prefix: string;

  @Column({ default: null, nullable: true })
  user_firstName: string;

  @Column({ default: null, nullable: true })
  user_lastName: string;

  @Column({ default: null, nullable: true })
  role_offer: string;

  @Column({ default: null, nullable: true })
  duty_name: string;

  @Column({ default: 0 })
  e_coupon: number;

  @OneToOne(() => User, (user) => user.teacher, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Faculty, (faculty) => faculty.teachers, { eager: true })
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;

  @Column()
  faculty_name: string;

  @ManyToOne(() => Department, (department) => department.teachers, { eager: true })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column()
  department_name: string;

  @ManyToOne(() => Library, (library) => library.teachers)
  @JoinColumn({ name: 'library_id' })
  library: Library;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
