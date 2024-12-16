import { Faculty } from 'src/faculty/entities/faculty.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  department_id: number;

  @Column()
  department_name: string; // ชื่อคณะ (เก็บเป็นข้อความ)

  @OneToMany(() => User, (user) => user.department)
  users: User[]; // ชื่อคณะ (เก็บเป็นข้อความ)

  @ManyToOne(() => Faculty, (faculty) => faculty.departments) // ความสัมพันธ์กับ Faculty
  @JoinColumn({ name: 'faculty_id' }) // Foreign key ในตาราง departments
  faculty: Faculty;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
