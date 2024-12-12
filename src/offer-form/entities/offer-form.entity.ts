import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  @Column()
  ISBN: string; // ISBN

  @Column()
  book_subject: string; // รายวิชา

  @Column()
  book_price: number; // ราคาสุทธิ

  @Column()
  book_quantity: number; // จำนวนเล่ม

  @Column({ type: 'text' })
  book_file: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
