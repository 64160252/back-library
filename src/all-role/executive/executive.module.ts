import { Module } from '@nestjs/common';
import { ExecutiveService } from './executive.service';
import { ExecutiveController } from './executive.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Executive } from './entities/executive.entity';
import { User } from 'src/user/entities/user.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Department } from 'src/department/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Executive, User, Faculty, Department])], // เชื่อมโยง Repository
  controllers: [ExecutiveController],
  providers: [ExecutiveService],
  exports: [ExecutiveService], // ส่งออก UserService ให้โมดูลอื่นใช้ได้
})
export class ExecutiveModule {}
