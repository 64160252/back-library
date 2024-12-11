import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { User } from 'src/user/entities/user.entity';
import { Student } from '../student/entities/student.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Department } from 'src/department/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Teacher, Student, User, Faculty, Department]),
  ], // เชื่อมโยง Repository
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService], // ส่งออก UserService ให้โมดูลอื่นใช้ได้
})
export class TeacherModule {}
