import { Department } from 'src/departments/entities/department.entity';
import { Faculty } from 'src/faculties/entities/faculty.entity';
import { Library } from 'src/library/entities/library.entity';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';
import { Store } from 'src/Role-and-Duty/store/entities/store.entity';
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

@Entity('offerFormsOfl')
export class OfferFormsOfl {
  @PrimaryGeneratedColumn()
  offerForms_ofl_id: number;

  @ManyToOne(() => User, (user) => user.offerFormsOfls, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @Column()
  user_name: string;

  @Column()
  role_offer: string;

  @ManyToOne(() => Library, (library) => library.offerFormsOfls, { eager: true })
  @JoinColumn({ name: 'library_id' })
  library: Library;

  @ManyToOne(() => Faculty, (faculty) => faculty.offerFormsOfls, { eager: true })
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;

  @Column()
  faculty_name: string;

  @ManyToOne(() => Department, (department) => department.offerFormsOfls, { eager: true })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column()
  department_name: string;

  @Column({ default: 'ไม่พบอีเมล', nullable: true })
  user_email: string;

  @Column({ default: 'ไม่พบเบอร์โทร', nullable: true })
  user_tel: string;

  @ManyToOne(() => Book, (book) => book.offerFormsOfls, { eager: true })
  @JoinColumn({ name: 'book_id' })
  book: Book;

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

  @ManyToOne(() => Store, (store) => store.offerFormsOfls, { eager: true })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  store_name: string;

  @Column({ default: 'กำลังดำเนินการ' })
  status: string;

  @Column({ default: 'ไม่มีรายละเอียด' })
  form_description: string;

  @Column({ type: 'text', nullable: true })
  imgs: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
