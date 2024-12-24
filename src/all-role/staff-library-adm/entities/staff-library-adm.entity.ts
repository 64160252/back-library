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

@Entity('staffsLibraryAdm')
export class StaffLibraryAdm {
  @PrimaryGeneratedColumn()
  staffs_library_adm_id: number;

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
