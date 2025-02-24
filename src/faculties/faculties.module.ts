import { Module } from '@nestjs/common';
import { FacultiesService } from './faculties.service';
import { FacultiesController } from './faculties.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faculty } from './entities/faculty.entity';
import { Teacher } from 'src/Role-and-Duty/teachers/entities/teacher.entity';
import { Library } from 'src/library/entities/library.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Faculty, Library, Teacher])],
  controllers: [FacultiesController],
  providers: [FacultiesService],
  exports: [FacultiesService],
})
export class FacultyModule {}
