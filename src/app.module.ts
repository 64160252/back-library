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
import { StudentModule } from './all-role/student/student.module';
import { TeacherModule } from './all-role/teacher/teacher.module';
import { Student } from './all-role/student/entities/student.entity';
import { Teacher } from './all-role/teacher/entities/teacher.entity';
import { FacultyModule } from './faculty/faculty.module';
import { DepartmentModule } from './department/department.module';
import { Faculty } from './faculty/entities/faculty.entity';
import { Department } from './department/entities/department.entity';
import { StaffFacultyModule } from './all-role/staff-faculty/staff-faculty.module';
import { StaffLibraryAdmModule } from './all-role/staff-library-adm/staff-library-adm.module';
import { StaffLibraryModule } from './all-role/staff-library/staff-library.module';
import { ExecutiveModule } from './all-role/executive/executive.module';
import { ECouponModule } from './e-coupon/e-coupon.module';
import { StoreModule } from './all-role/store/store.module';
import { Store } from './all-role/store/entities/store.entity';
import { Executive } from './all-role/executive/entities/executive.entity';
import { StaffFaculty } from './all-role/staff-faculty/entities/staff-faculty.entity';
import { StaffLibraryAdm } from './all-role/staff-library-adm/entities/staff-library-adm.entity';
import { StaffLibrary } from './all-role/staff-library/entities/staff-library.entity';
import { OfferForm } from './offer-form/entities/offer-form.entity';
import { OfferFormModule } from './offer-form/offer-form.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'images'), // ตั้งค่าเส้นทางไปยัง 'src/images'
      serveRoot: '/images', // ตั้งค่า URL ที่ใช้เรียกไฟล์
    }),
    ConfigModule.forRoot({
      isGlobal: true, // เพื่อให้ ConfigModule ใช้งานได้ทั่วทั้งโปรเจกต์
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db', // ชื่อของ MySQL service ใน Docker Compose
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'testdb',
      entities: [
        User,
        Role,
        Student,
        Teacher,
        Faculty,
        Department,
        Store,
        Executive,
        StaffFaculty,
        StaffLibraryAdm,
        StaffLibrary,
        OfferForm,
      ],
      synchronize: true,
    }),
    UserModule,
    RoleModule,
    AuthModule,
    StudentModule,
    TeacherModule,
    FacultyModule,
    DepartmentModule,
    StaffFacultyModule,
    StaffLibraryAdmModule,
    StaffLibraryModule,
    ExecutiveModule,
    ECouponModule,
    StoreModule,
    OfferFormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
