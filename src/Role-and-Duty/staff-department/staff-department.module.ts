import { Module } from '@nestjs/common';
import { StaffsDepartmentService } from './staff-department.service';
import { StaffsDepartmentController } from './staff-department.controller';
import { StaffDepartment } from './entities/staff-department.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StaffDepartment, User, Role])],
  controllers: [StaffsDepartmentController],
  providers: [StaffsDepartmentService],
  exports: [StaffsDepartmentService],
})
export class StaffDepartmentModule {}
