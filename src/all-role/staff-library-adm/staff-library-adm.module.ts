import { Module } from '@nestjs/common';
import { StaffLibraryAdmService } from './staff-library-adm.service';
import { StaffLibraryAdmController } from './staff-library-adm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffLibraryAdm } from './entities/staff-library-adm.entity';
import { User } from 'src/user/entities/user.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Department } from 'src/department/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffLibraryAdm, User, Faculty, Department]),
  ], // เชื่อมโยง Repository
  controllers: [StaffLibraryAdmController],
  providers: [StaffLibraryAdmService],
  exports: [StaffLibraryAdmService],
})
export class StaffLibraryAdmModule {}
