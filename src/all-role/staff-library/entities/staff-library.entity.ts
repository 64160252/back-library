import { User } from 'src/user/entities/user.entity';
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

@Entity('staffsLibrary')
export class StaffLibrary {
  @PrimaryGeneratedColumn()
  staffs_library_id: number;

  // @Column({ default: ' ' })
  // user_prefix: string;

  // @Column()
  // user_firstName: string;

  // @Column()
  // user_lastName: string;

  // @Column()
  // offer_position: string;

  // @Column()
  // position_name: string;

  // @Column()
  // management_position_name: string;

  @OneToOne(() => User, (user) => user.student, { cascade: true }) // เชื่อมกับ User
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
