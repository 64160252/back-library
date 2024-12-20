// import { Executive } from 'src/all-role/executive/entities/executive.entity';
// import { Market } from 'src/all-role/market/entities/market.entity';
// import { StaffFaculty } from 'src/all-role/staff-faculty/entities/staff-faculty.entity';
// import { StaffLibraryAdm } from 'src/all-role/staff-library-adm/entities/staff-library-adm.entity';
// import { StaffLibraryNor } from 'src/all-role/staff-library-nor/entities/staff-library-nor.entity';
import { Student } from 'src/all-role/student/entities/student.entity';
// import { Teacher } from 'src/all-role/teacher/entities/teacher.entity';
import { Department } from 'src/department/entities/department.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { OfferForm } from 'src/offer-form/entities/offer-form.entity';
import { Role } from 'src/role/entities/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true })
  user_name: string;

  @Column({ unique: true })
  user_email: string;

  @Column()
  user_password: string;

  @Column({ unique: true })
  user_tel: string;

  @ManyToOne(() => Faculty, (faculty) => faculty.users)
  @JoinColumn({ name: 'faculty_id' }) // ชื่อคอลัมน์ในฐานข้อมูล
  faculty: Faculty; // ชื่อคณะ (เก็บเป็นข้อความ)

  @ManyToOne(() => Department, (department) => department.users)
  @JoinColumn({ name: 'department_id' }) // ชื่อคอลัมน์ในฐานข้อมูล
  department: Department; // ชื่อสาขา (เก็บเป็นข้อความ)

  @OneToMany(() => OfferForm, (OfferForm) => OfferForm.user)
  OfferForms: OfferForm[];

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' }) // ชื่อคอลัมน์ในฐานข้อมูล
  role: Role;

  @OneToOne(() => Student, (student) => student.user)
  student: Student;

  // @OneToOne(() => Teacher, (teacher) => teacher.user)
  // teacher: Teacher;

  // @OneToOne(() => Executive, (executive) => executive.user)
  // executive: Executive;

  // @OneToOne(() => StaffFaculty, (staffFaculty) => staffFaculty.user)
  // staffFaculty: StaffFaculty;

  // @OneToOne(() => StaffLibraryAdm, (staffLibraryAdm) => staffLibraryAdm.user)
  // staffLibraryAdm: StaffLibraryAdm;

  // @OneToOne(() => StaffLibraryNor, (staffLibraryNor) => staffLibraryNor.user)
  // staffLibraryNor: StaffLibraryNor;

  // @OneToOne(() => Market, (market) => market.user)
  // market: Market;

  @Column({ nullable: true })
  refresh_token: string; // เก็บ Refresh Token

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
