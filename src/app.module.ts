import * as session from 'express-session';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { Role } from './roles/entities/role.entity';
import { RoleModule } from './roles/roles.module';
import { Library } from './library/entities/library.entity';
import { LibraryModule } from './library/library.module';
import { Faculty } from './faculties/entities/faculty.entity';
import { FacultyModule } from './faculties/faculties.module';
import { Department } from './departments/entities/department.entity';
import { DepartmentModule } from './departments/departments.module';
import { Executive } from './Role-and-Duty/executive/entities/executive.entity';
import { ExecutiveModule } from './Role-and-Duty/executive/executive.module';
import { Admin } from './Role-and-Duty/admin/entities/admin.entity';
import { AdminModule } from './Role-and-Duty/admin/admin.module';
import { StaffLibrary } from './Role-and-Duty/staff-library/entities/staff-library.entity';
import { StaffLibraryModule } from './Role-and-Duty/staff-library/staff-library.module';
import { StaffDepartment } from './Role-and-Duty/staff-department/entities/staff-department.entity';
import { StaffDepartmentModule } from './Role-and-Duty/staff-department/staff-department.module';
import { StaffFaculty } from './Role-and-Duty/staff-faculty/entities/staff-faculty.entity';
import { StaffFacultyModule } from './Role-and-Duty/staff-faculty/staff-faculty.module';
import { Teacher } from './Role-and-Duty/teachers/entities/teacher.entity';
import { TeacherModule } from './Role-and-Duty/teachers/teachers.module';
import { Student } from './Role-and-Duty/student/entities/student.entity';
import { StudentModule } from './Role-and-Duty/student/student.module';
import { Store } from './Role-and-Duty/store/entities/store.entity';
import { StoreModule } from './Role-and-Duty/store/store.module';
import { Book } from './books/entities/book.entity';
import { BookModule } from './books/books.module';
import { OfferFormsOnl } from './offer-forms-onl/entities/offer-forms-onl.entity';
import { OfferFormsOnlModule } from './offer-forms-onl/offer-forms-onl.module';
import { OfferFormsOflModule } from './offer-forms-ofl/offer-forms-ofl.module';
import { BookfairDateModule } from './bookfair-date/bookfair-date.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'bookfair',
      password: 'Bookfair@2025#',
      database: 'bookfair_db',
      entities: [
        User,
        Role,
        Library,
        Faculty,
        Department,
        Executive,
        Admin,
        StaffLibrary,
        StaffFaculty,
        StaffDepartment,
        Teacher,
        Student,
        Store,
        Book,
        OfferFormsOnl,
      ],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    RoleModule,
    LibraryModule,
    FacultyModule,
    DepartmentModule,
    ExecutiveModule,
    AdminModule,
    StaffLibraryModule,
    StaffFacultyModule,
    StaffDepartmentModule,
    TeacherModule,
    StudentModule,
    StoreModule,
    BookModule,
    OfferFormsOnlModule,
    OfferFormsOflModule,
    BookfairDateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
