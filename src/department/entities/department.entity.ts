import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Student } from 'src/all-role/student/entities/student.entity';
import { Teacher } from 'src/all-role/teacher/entities/teacher.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  department_id: number;

  @Column()
  department_name: string; // ชื่อคณะ (เก็บเป็นข้อความ)

  @OneToMany(() => Student, (student) => student.department)
  students: Student[]; // ชื่อคณะ (เก็บเป็นข้อความ)

  @OneToMany(() => Teacher, (teacher) => teacher.department)
  teachers: Teacher[]; // ชื่อคณะ (เก็บเป็นข้อความ)

  @ManyToOne(() => Faculty, (faculty) => faculty.departments) // ความสัมพันธ์กับ Faculty
  @JoinColumn({ name: 'faculty_id' }) // Foreign key ในตาราง departments
  faculty: Faculty;
}
