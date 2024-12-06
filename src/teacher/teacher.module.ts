import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, User])], // เชื่อมโยง Repository
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService], // ส่งออก UserService ให้โมดูลอื่นใช้ได้
})
export class TeacherModule {}
