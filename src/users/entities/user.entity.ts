import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { Executive } from 'src/Role-and-Duty/executive/entities/executive.entity';
import { Admin } from 'src/Role-and-Duty/admin/entities/admin.entity';
import { StaffLibrary } from 'src/Role-and-Duty/staff-library/entities/staff-library.entity';
import { StaffFaculty } from 'src/Role-and-Duty/staff-faculty/entities/staff-faculty.entity';
import { StaffDepartment } from 'src/Role-and-Duty/staff-department/entities/staff-department.entity';
import { Teacher } from 'src/Role-and-Duty/teachers/entities/teacher.entity';
import { Student } from 'src/Role-and-Duty/student/entities/student.entity';
import { Store } from 'src/Role-and-Duty/store/entities/store.entity';
import { OfferFormsOnl } from 'src/offer-forms-onl/entities/offer-forms-onl.entity';

@Entity('users')
export class User {
  @PrimaryColumn()
  user_id: number;

  @Column({ unique: true })
  user_name: string;

  @Column({ default: 'ไม่พบอีเมล', nullable: true })
  user_email: string;

  @Column()
  user_password: string;

  @Column({ default: 'ไม่พบเบอร์โทร', nullable: true, unique: true })
  user_tel: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column()
  role_name: string;

  @OneToOne(() => Executive, (executive) => executive.user)
  executive: Executive;

  @OneToOne(() => Admin, (admin) => admin.user)
  admin: Admin;

  @OneToOne(() => StaffLibrary, (staffLibrary) => staffLibrary.user)
  staffLibrary: StaffLibrary;

  @OneToOne(() => StaffFaculty, (staffFaculty) => staffFaculty.user)
  staffFaculty: StaffFaculty;

  @OneToOne(() => StaffDepartment, (staffDepartment) => staffDepartment.user)
  staffDepartment: StaffDepartment;

  @OneToOne(() => Teacher, (teacher) => teacher.user)
  teacher: Teacher;

  @OneToOne(() => Student, (student) => student.user)
  student: Student;

  @OneToOne(() => Store, (store) => store.user)
  store: Store;

  @Column({ nullable: true, length: 1024 })
  refresh_token: string;

  @OneToMany(() => OfferFormsOnl, (offerFormsOnls) => offerFormsOnls.user)
  offerFormsOnls: OfferFormsOnl[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
