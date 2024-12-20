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

  @Column()
  market_name: string; // ชื่อร้านค้า

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
