import { Store } from 'src/all-role/store/entities/store.entity';
import { Department } from 'src/department/entities/department.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
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

@Entity('offerForms')
export class OfferForm {
  @PrimaryGeneratedColumn()
  offer_form_id: number;

  @Column({ default: ' ' })
  user_prefix: string;

  @Column()
  user_fullname: string;

  @Column()
  user_name: string;

  @ManyToOne(() => Role, (role) => role.OfferForms, { eager: true }) // เพิ่ม eager loading
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column()
  user_email: string;

  @Column()
  user_tel: string;

  @ManyToOne(() => Faculty, (faculty) => faculty.OfferForms, { eager: true }) // เพิ่ม eager loading
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;

  @ManyToOne(() => Department, (department) => department.OfferForms, {
    eager: true,
  }) // เพิ่ม eager loading
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => Store, (store) => store.OfferForms, { eager: true }) // เพิ่ม eager loading
  @JoinColumn({ name: 'store_id' })
  store: Store; // ชื่อร้านค้า

  @Column()
  book_title: string; // ชื่อเรื่อง

  @Column()
  book_author: string; // ชื่อผู้แต่ง

  @Column()
  published_year: number; // ปีพิมพ์

  @Column({ unique: true })
  ISBN: string; // ISBN

  @Column()
  book_subject: string; // รายวิชา

  @Column()
  book_price: number; // ราคาสุทธิ

  @Column()
  book_quantity: number; // จำนวนเล่ม

  @Column()
  coupon_used: string;

  @Column('simple-array', { nullable: true })
  book_imgs: string[];

  @ManyToOne(() => User, (user) => user.OfferForms, { eager: true }) // เพิ่ม eager loading
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
