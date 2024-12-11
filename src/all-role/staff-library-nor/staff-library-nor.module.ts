import { Module } from '@nestjs/common';
import { StaffLibraryNorService } from './staff-library-nor.service';
import { StaffLibraryNorController } from './staff-library-nor.controller';
import { StaffLibraryNor } from './entities/staff-library-nor.entity';
import { User } from 'src/user/entities/user.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Department } from 'src/department/entities/department.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffLibraryNor, User, Faculty, Department]),
  ], // เชื่อมโยง Repository
  controllers: [StaffLibraryNorController],
  providers: [StaffLibraryNorService],
  exports: [StaffLibraryNorService],
})
export class StaffLibraryNorModule {}
