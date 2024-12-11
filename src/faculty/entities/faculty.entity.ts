import { Department } from 'src/department/entities/department.entity';
import { Student } from 'src/all-role/student/entities/student.entity';
import { Teacher } from 'src/all-role/teacher/entities/teacher.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('faculties')
export class Faculty {
  @PrimaryGeneratedColumn()
  faculty_id: number;

  @Column()
  faculty_name: string; // ชื่อคณะ (เก็บเป็นข้อความ)

  @OneToMany(() => Student, (student) => student.faculty)
  students: Student[]; // ชื่อคณะ (เก็บเป็นข้อความ)

  @OneToMany(() => Teacher, (teacher) => teacher.faculty)
  teachers: Teacher[]; // ชื่อคณะ (เก็บเป็นข้อความ)

  @OneToMany(() => Department, (department) => department.faculty)
  departments: Department[]; // ชื่อคณะ (เก็บเป็นข้อความ)
}
