import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { Library } from './entities/library.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faculty } from 'src/faculties/entities/faculty.entity';
import { Department } from 'src/departments/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Library, Faculty, Department])],
  controllers: [LibraryController],
  providers: [LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
