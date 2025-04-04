import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.user_password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async refreshToken(refreshToken: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const newAccessToken = this.jwtService.sign(
      { username: payload.username, sub: payload.sub, role: payload.role },
      { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return { access_token: newAccessToken };
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const userId = Number(user.user_id);
    if (isNaN(userId)) {
      throw new UnauthorizedException('Invalid user ID');
    }

    const payload = {
      sub: userId,
      email: user.user_email,
      username: user.user_name,
      tel: user.user_tel,
      role: user.role?.role_name,
      executive:
        user.role?.role_name === 'Executive'
          ? {
            executive_id: user.executive?.executives_id,
            user_prefix: user.executive?.user_prefix,
            user_firstName: user.executive?.user_firstName,
            user_lastName: user.executive?.user_lastName,
            duty_name: user.executive?.duty_name,
          }
          : null,
      admin:
        user.role?.role_name === 'Admin'
          ? {
            admin: user.admin?.admins_id,
            user_prefix: user.admin?.user_prefix,
            user_firstName: user.admin?.user_firstName,
            user_lastName: user.admin?.user_lastName,
            duty_name: user.admin?.duty_name,
          }
          : null,
      staffLibrary:
        user.role?.role_name === 'StaffLibrary'
          ? {
            staffLibrary: user.staffLibrary?.staffs_library_id,
            user_prefix: user.staffLibrary?.user_prefix,
            user_firstName: user.staffLibrary?.user_firstName,
            user_lastName: user.staffLibrary?.user_lastName,
            duty_name: user.staffLibrary?.duty_name,
          }
          : null,
      staffFaculty:
        user.role?.role_name === 'StaffFaculty'
          ? {
            staffFaculty: user.staffFaculty?.staffs_faculty_id,
            user_prefix: user.staffFaculty?.user_prefix,
            user_firstName: user.staffFaculty?.user_firstName,
            user_lastName: user.staffFaculty?.user_lastName,
            duty_name: user.staffFaculty?.duty_name,
            faculty_id: user.staffFaculty?.faculty ? user.staffFaculty.faculty.faculty_id : '',
            department_id: user.staffFaculty?.department ? user.staffFaculty.department.department_id : '',
            faculty_name: user.staffFaculty?.faculty_name ?? '',
            department_name: user.staffFaculty?.department_name ?? '',
          }
          : null,
      staffDepartment:
        user.role?.role_name === 'StaffDepartment'
          ? {
            staffDepartment: user.staffDepartment?.staffs_department_id,
            user_prefix: user.staffDepartment?.user_prefix,
            user_firstName: user.staffDepartment?.user_firstName,
            user_lastName: user.staffDepartment?.user_lastName,
            duty_name: user.staffDepartment?.duty_name,
          }
          : null,
      teacher:
        user.role?.role_name === 'Teacher'
          ? {
            user_id: user.user_id,
            teacher: user.teacher?.teacher_id,
            user_prefix: user.teacher?.user_prefix,
            user_firstName: user.teacher?.user_firstName,
            user_lastName: user.teacher?.user_lastName,
            role_offer: user.teacher?.role_offer,
            duty_name: user.teacher?.duty_name,
            faculty_id: user.teacher?.faculty.faculty_id,
            department_id: user.teacher?.department.department_id,
            faculty_name: user.teacher?.faculty_name,
            department_name: user.teacher?.department_name,
            e_coupon: user.teacher?.e_coupon,
          }
          : null,
      student:
        user.role?.role_name === 'Student'
          ? {
            student: user.student?.student_id,
            user_prefix: user.student?.user_prefix,
            user_firstName: user.student?.user_firstName,
            user_lastName: user.student?.user_lastName,
            role_offer: user.student?.role_offer,
            duty_name: user.student?.duty_name,
            // faculty_id: user.student?.faculty.faculty_id,
            // department_id: user.student?.department.department_id,
            faculty_name: user.student?.faculty_name,
            department_name: user.student?.department_name,
          }
          : null,
      store:
        user.role?.role_name === 'Store'
          ? {
            store: user.store?.store_id,
            store_id: user.store?.store_id,
            store_name: user.store?.store_name,
          }
          : null,
    };
    console.log('Payload to be signed:', payload);

    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    await this.usersService.createRefreshToken(user.user_id, refresh_token);

    return {
      access_token,
      refresh_token,
      role: user.role.role_name,
    };
  }

  async logout(userId: number) {
    await this.usersService.removeRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }
}