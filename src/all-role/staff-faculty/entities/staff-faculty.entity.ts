import { Department } from 'src/department/entities/department.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('staffsFaculty')
export class StaffFaculty {
  @PrimaryGeneratedColumn()
  staff_faculty_id: number;

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
