import { Store } from 'src/Role-and-Duty/store/entities/store.entity';
import {
  Entity,
  ManyToOne,
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

  @ManyToOne(() => Store, (store) => store.books, { eager: true })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column()
  store_name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
