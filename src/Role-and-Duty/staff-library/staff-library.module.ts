import { Module } from '@nestjs/common';
import { StaffsLibraryService } from './staff-library.service';
import { StaffsLibraryController } from './staff-library.controller';
import { StaffLibrary } from './entities/staff-library.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StaffLibrary, User, Role])],
  controllers: [StaffsLibraryController],
  providers: [StaffsLibraryService],
  exports: [StaffsLibraryService],
})
export class StaffLibraryModule {}
