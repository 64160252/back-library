import { Department } from 'src/department/entities/department.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  student_id: number;

  @OneToOne(() => User) // เชื่อมกับ User
  @JoinColumn({ name: 'user_id' }) // เชื่อม Foreign Key
  user: User;

  @ManyToOne(() => Faculty, (faculty) => faculty.students)
  faculty: Faculty; // ชื่อคณะ (เก็บเป็นข้อความ)

  @ManyToOne(() => Department, (department) => department.students)
  @JoinColumn({ name: 'department_id' }) // ชื่อคอลัมน์ในฐานข้อมูล
  department: Department;
}
