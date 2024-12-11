import { Module } from '@nestjs/common';
import { StaffFacultyService } from './staff-faculty.service';
import { StaffFacultyController } from './staff-faculty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffFaculty } from './entities/staff-faculty.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { User } from 'src/user/entities/user.entity';
import { Department } from 'src/department/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffFaculty, User, Faculty, Department]),
  ], // เชื่อมโยง Repository
  controllers: [StaffFacultyController],
  providers: [StaffFacultyService],
  exports: [StaffFacultyService],
})
export class StaffFacultyModule {}
