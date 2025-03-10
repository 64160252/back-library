import { Department } from 'src/departments/entities/department.entity';
import { Faculty } from 'src/faculties/entities/faculty.entity';
import { Library } from 'src/library/entities/library.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('offerFormsOnl')
export class OfferFormsOnl {
  @PrimaryGeneratedColumn()
  offerForms_onl_id: number;

  @ManyToOne(() => User, (user) => user.offerFormsOnls, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @Column()
  user_name: string;

  @Column()
  role_offer: string;

  @ManyToOne(() => Library, (library) => library.offerFormsOnls, { eager: true })
  @JoinColumn({ name: 'library_id' })
  library: Library;

  @ManyToOne(() => Faculty, (faculty) => faculty.offerFormsOnls, { eager: true })
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;

  @Column()
  faculty_name: string;

  @ManyToOne(() => Department, (department) => department.offerFormsOnls, { eager: true })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column()
  department_name: string;

  @Column({ default: 'ไม่พบอีเมล', nullable: true })
  user_email: string;

  @Column({ default: 'ไม่พบเบอร์โทร', nullable: true })
  user_tel: string;

  @Column()
  ISBN: string;

  @Column()
  book_title: string;

  @Column()
  book_author: string;

  @Column({ default: 'ไม่ระบุ' })
  book_course: string;

  @Column({ default: 0 })
  price: number;

  @Column({ default: 'กำลังดำเนินการ' })
  status: string;

  @Column({ default: 'ไม่มีรายละเอียด' })
  form_description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
