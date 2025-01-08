import { Module } from '@nestjs/common';
import { StaffLibraryService } from './staff-library.service';
import { StaffLibraryController } from './staff-library.controller';
import { StaffLibrary } from './entities/staff-library.entity';
import { User } from 'src/user/entities/user.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Department } from 'src/department/entities/department.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffLibrary, User, Faculty, Department]),
  ], // เชื่อมโยง Repository
  controllers: [StaffLibraryController],
  providers: [StaffLibraryService],
  exports: [StaffLibraryService],
})
export class StaffLibraryModule {}
