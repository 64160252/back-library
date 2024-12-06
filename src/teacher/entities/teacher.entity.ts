import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  teacher_id: number;

  @OneToOne(() => User) // เชื่อมกับ User
  @JoinColumn({ name: 'user_id' }) // เชื่อม Foreign Key
  user: User;

  @Column({ nullable: true })
  faculty: string; // ชื่อคณะ (เก็บเป็นข้อความ)

  @Column({ nullable: true })
  department: string; // ชื่อสาขา (เก็บเป็นข้อความ)
}
