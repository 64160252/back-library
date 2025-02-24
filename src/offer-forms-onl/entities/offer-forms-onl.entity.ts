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

  @Column({ unique: true })
  user_name: string;

  @Column()
  role_offer: string;

  @Column()
  faculty_name: string;

  @Column()
  department_name: string;

  @Column({ default: 'ไม่พบอีเมล', nullable: true })
  user_email: string;

  @Column({ default: 'ไม่พบเบอร์โทร', nullable: true, unique: true })
  user_tel: string;

  @Column()
  ISBN: string;

  @Column()
  book_title: string;

  @Column()
  book_author: string;

  @Column()
  book_course: string;

  @Column()
  form_description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
