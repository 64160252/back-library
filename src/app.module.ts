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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // เพื่อให้ ConfigModule ใช้งานได้ทั่วทั้งโปรเจกต์
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', // ปล่อยว่างไว้หากไม่ได้ตั้งรหัสผ่าน
      database: 'testdb',
      entities: [User, Role, Student],
      synchronize: false,
    }),
    UserModule,
    RoleModule,
    AuthModule,
    StudentModule,
    TeacherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
