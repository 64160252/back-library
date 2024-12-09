import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { RoleModule } from './role/role.module';
import { Role } from './role/entities/role.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { Student } from './student/entities/student.entity';
import { Teacher } from './teacher/entities/teacher.entity';
import { FacultyModule } from './faculty/faculty.module';
import { DepartmentModule } from './department/department.module';
import { Faculty } from './faculty/entities/faculty.entity';
import { Department } from './department/entities/department.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // เพื่อให้ ConfigModule ใช้งานได้ทั่วทั้งโปรเจกต์
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db', // ชื่อของ MySQL service ใน Docker Compose
      port: 3306,
      username: 'root',
      password: 'rootpassword',
      database: 'testdb',
      entities: [User, Role, Student, Teacher, Faculty, Department],
      synchronize: true,
    }),
    UserModule,
    RoleModule,
    AuthModule,
    StudentModule,
    TeacherModule,
    FacultyModule,
    DepartmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
