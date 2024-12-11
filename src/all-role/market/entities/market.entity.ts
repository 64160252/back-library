import { User } from 'src/user/entities/user.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('markets')
export class Market {
  @PrimaryGeneratedColumn()
  market_id: number;

  @OneToOne(() => User) // เชื่อมกับ User
  @JoinColumn({ name: 'user_id' }) // เชื่อม Foreign Key
  user: User;
}
