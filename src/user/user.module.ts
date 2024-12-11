import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // ต้องนำเข้า TypeOrmModule
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity'; // นำเข้า Entity ของ User
import { Role } from 'src/role/entities/role.entity';
import { Student } from 'src/all-role/student/entities/student.entity';
import { Teacher } from 'src/all-role/teacher/entities/teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Student, Teacher])], // เชื่อมโยง Repository
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // ส่งออก UserService ให้โมดูลอื่นใช้ได้
})
export class UserModule {}
