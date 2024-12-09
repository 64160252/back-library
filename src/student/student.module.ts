import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { User } from 'src/user/entities/user.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Department } from 'src/department/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, User, Faculty, Department])], // เชื่อมโยง Repository
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService], // ส่งออก UserService ให้โมดูลอื่นใช้ได้
})
export class StudentModule {}
