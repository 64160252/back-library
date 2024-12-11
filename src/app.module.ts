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
import { StaffLibraryNorModule } from './all-role/staff-library-nor/staff-library-nor.module';
import { ExecutiveModule } from './all-role/executive/executive.module';
import { ECouponModule } from './e-coupon/e-coupon.module';
import { MarketModule } from './all-role/market/market.module';
import { Market } from './all-role/market/entities/market.entity';
import { Executive } from './all-role/executive/entities/executive.entity';
import { StaffFaculty } from './all-role/staff-faculty/entities/staff-faculty.entity';
import { StaffLibraryAdm } from './all-role/staff-library-adm/entities/staff-library-adm.entity';
import { StaffLibraryNor } from './all-role/staff-library-nor/entities/staff-library-nor.entity';
import { OfferForm } from './offer-form/entities/offer-form.entity';
import { OfferFormModule } from './offer-form/offer-form.module';

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
      entities: [
        User,
        Role,
        Student,
        Teacher,
        Faculty,
        Department,
        Market,
        Executive,
        StaffFaculty,
        StaffLibraryAdm,
        StaffLibraryNor,
        OfferForm
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
    StaffLibraryNorModule,
    ExecutiveModule,
    ECouponModule,
    MarketModule,
    OfferFormModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
