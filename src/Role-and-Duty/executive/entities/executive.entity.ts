import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('executives')
export class Executive {
  @PrimaryGeneratedColumn()
  executives_id: number;

  @Column({ default: null, nullable: true })
  user_prefix: string;

  @Column({ default: null, nullable: true })
  user_firstName: string;

  @Column({ default: null, nullable: true })
  user_lastName: string;

  @Column({ default: null, nullable: true })
  duty_name: string;

  @OneToOne(() => User, (user) => user.executive, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
