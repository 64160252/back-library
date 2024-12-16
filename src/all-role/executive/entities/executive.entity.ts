import { Department } from 'src/department/entities/department.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('executives')
export class Executive {
  @PrimaryGeneratedColumn()
  executive_id: number;

  // @OneToOne(() => User, (user) => user.student, { cascade: true }) // เชื่อมกับ User
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  // @ManyToOne(() => Faculty, (faculty) => faculty.students)
  // @JoinColumn({ name: 'faculty_id' }) // ชื่อคอลัมน์ในฐานข้อมูล
  // faculty: Faculty; // ชื่อคณะ (เก็บเป็นข้อความ)

  // @ManyToOne(() => Department, (department) => department.students)
  // @JoinColumn({ name: 'department_id' }) // ชื่อคอลัมน์ในฐานข้อมูล
  // department: Department;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
