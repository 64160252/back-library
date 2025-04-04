import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';
import { OfferFormsOfl } from 'src/offer-forms-ofl/entities/offer-forms-ofl.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  store_id: number;

  @Column({ default: null, nullable: true })
  store_name: string;

  @OneToOne(() => User, (user) => user.store, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OfferFormsOfl, (offerFormsOfls) => offerFormsOfls.store)
  offerFormsOfls: OfferFormsOfl[];

  @OneToMany(() => Book, (books) => books.store, { cascade: true })
  books: Book[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
