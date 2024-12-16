import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // ต้องนำเข้า TypeOrmModule
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity'; // นำเข้า Entity ของ User
import { Role } from 'src/role/entities/role.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Department } from 'src/department/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Faculty, Department])], // เชื่อมโยง Repository
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // ส่งออก UserService ให้โมดูลอื่นใช้ได้
})
export class UserModule {}
