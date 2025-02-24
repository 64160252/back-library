import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Faculty } from 'src/faculties/entities/faculty.entity';
import { Library } from 'src/library/entities/library.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department, Faculty, Library])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [DepartmentsService],
})
export class DepartmentModule {}
