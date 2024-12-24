import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // ต้องนำเข้า TypeOrmModule
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity'; // นำเข้า Entity ของ User
import { Role } from 'src/role/entities/role.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Department } from 'src/department/entities/department.entity';
import { Student } from 'src/all-role/student/entities/student.entity';
import { Teacher } from 'src/all-role/teacher/entities/teacher.entity';
import { StaffLibraryNor } from 'src/all-role/staff-library-nor/entities/staff-library-nor.entity';
import { StaffLibraryAdm } from 'src/all-role/staff-library-adm/entities/staff-library-adm.entity';
import { Executive } from 'src/all-role/executive/entities/executive.entity';
import { StaffFaculty } from 'src/all-role/staff-faculty/entities/staff-faculty.entity';
import { Market } from 'src/all-role/market/entities/market.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Faculty,
      Department,
      Student,
      Teacher,
      Executive,
      StaffLibraryNor,
      StaffLibraryAdm,
      StaffFaculty,
      Market,
    ]),
  ], // เชื่อมโยง Repository
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // ส่งออก UserService ให้โมดูลอื่นใช้ได้
})
export class UserModule {}
