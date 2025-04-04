import { OfferFormsOfl } from 'src/offer-forms-ofl/entities/offer-forms-ofl.entity';
import { Store } from 'src/Role-and-Duty/store/entities/store.entity';
import {
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  book_id: number;

  @Column()
  ISBN: string;

  @Column()
  book_title: string;

  @Column()
  book_author: string;

  @Column()
  book_price: number;

  @Column()
  book_category: string;

  @Column()
  book_published: string;

  @Column()
  book_volumn: number;

  @Column({ default: 'ไม่มีรายละเอียด' })
  book_description: string;

  @Column({ default: 'ยังไม่ขาย' })
  book_status: string;

  @ManyToOne(() => Store, (store) => store.books, { eager: true })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @OneToMany(() => OfferFormsOfl, (offerFormsOfls) => offerFormsOfls.book)
  offerFormsOfls: OfferFormsOfl[];

  @Column()
  store_name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
