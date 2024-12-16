import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/role/entities/role.entity';
import * as bcrypt from 'bcryptjs';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Department } from 'src/department/entities/department.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const {
      faculty,
      department,
      role,
      user_email,
      user_name,
      user_tel,
      user_password, // รหัสผ่านที่รับเข้ามา
      ...userData
    } = createUserDto;

    try {
      // ตรวจสอบข้อมูลซ้ำ: Email
      const existingEmail = await this.userRepository.findOne({
        where: { user_email },
      });
      if (existingEmail) {
        throw new ConflictException(`Email '${user_email}' is already in use.`);
      }

      // ตรวจสอบข้อมูลซ้ำ: Name
      const existingName = await this.userRepository.findOne({
        where: { user_name },
      });
      if (existingName) {
        throw new ConflictException(
          `Username '${user_name}' is already in use.`,
        );
      }

      // ตรวจสอบข้อมูลซ้ำ: Tel
      const existingTel = await this.userRepository.findOne({
        where: { user_tel },
      });
      if (existingTel) {
        throw new ConflictException(
          `Telephone number '${user_tel}' is already in use.`,
        );
      }

      // ตรวจสอบ Faculty
      let facultyEntity = null;
      if (faculty) {
        if (typeof faculty === 'number') {
          facultyEntity = await this.facultyRepository.findOne({
            where: { faculty_id: faculty },
          });
        } else if (typeof faculty === 'string') {
          facultyEntity = await this.facultyRepository.findOne({
            where: { faculty_name: faculty },
          });
        }

        if (!facultyEntity) {
          throw new BadRequestException(
            `Faculty not found with ${typeof faculty === 'number' ? 'ID' : 'name'}: ${faculty}`,
          );
        }
      }

      // ตรวจสอบ Department
      let departmentEntity = null;
      if (department) {
        if (typeof department === 'number') {
          departmentEntity = await this.departmentRepository.findOne({
            where: { department_id: department },
          });
        } else if (typeof department === 'string') {
          departmentEntity = await this.departmentRepository.findOne({
            where: { department_name: department },
          });
        }

        if (!departmentEntity) {
          throw new BadRequestException(
            `Department not found with ${typeof department === 'number' ? 'ID' : 'name'}: ${department}`,
          );
        }
      }

      // ตรวจสอบ Role
      let roleEntity = null;
      if (role) {
        if (typeof role === 'number') {
          roleEntity = await this.roleRepository.findOne({
            where: { role_id: role },
          });
        } else if (typeof role === 'string') {
          roleEntity = await this.roleRepository.findOne({
            where: { role_name: role },
          });
        }

        if (!roleEntity) {
          throw new BadRequestException(
            `Role not found with ${typeof role === 'number' ? 'ID' : 'name'}: ${role}`,
          );
        }
      }

      // เข้ารหัสรหัสผ่านด้วย bcrypt
      const saltRounds = 10; // จำนวนรอบของการเข้ารหัส
      const hashedPassword = await bcrypt.hash(user_password, saltRounds);

      // สร้าง User
      const user = this.userRepository.create({
        ...userData,
        user_email,
        user_name,
        user_tel,
        user_password: hashedPassword, // บันทึกรหัสผ่านที่เข้ารหัสแล้ว
        faculty: facultyEntity,
        department: departmentEntity,
        role: roleEntity,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      // หาก Error เป็น HTTP Exception (เช่น Conflict หรือ BadRequest) ให้โยนกลับไป
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // หากเป็น Error อื่น ให้แปลงเป็น Internal Server Error
      throw new BadRequestException(`User creation failed: ${error.message}`);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.faculty', 'faculty')
      .leftJoinAndSelect('user.department', 'department')
      .select([
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
        'faculty.faculty_name',
        'department.department_name',
        'role.role_name',
      ])
      .getMany();
  }

  async findOne(userId: number): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.faculty', 'faculty')
      .leftJoinAndSelect('user.department', 'department')
      .select([
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
        'faculty.faculty_name',
        'department.department_name',
        'role.role_name',
      ])
      .where('user.user_id = :id', { userId })
      .getOne();
  }

  // ตรวจสอบว่าผู้ใช้ถูกดึงออกมาจากฐานข้อมูลถูกต้อง
  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.user_name = :username', { username })
      .getOne();

    console.log(user); // เพิ่ม log เพื่อตรวจสอบว่าได้ผู้ใช้ที่ถูกต้องหรือไม่
    return user;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (user) {
      user.refresh_token = refreshToken;
      await this.userRepository.save(user);
    }
  }

  // ฟังก์ชันในการลบ refresh token
  async removeRefreshToken(userId: number) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    if (user) {
      user.refresh_token = null; // ลบค่า refresh_token
      await this.userRepository.save(user);
    }
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { role, faculty, department, user_password, ...userData } =
      updateUserDto;

    // ค้นหา User ที่ต้องการอัปเดต
    const user = await this.findOne(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // ตรวจสอบและอัปเดต Role
    if (role) {
      const roleEntity = await this.getEntityByIdOrName(
        this.roleRepository,
        role,
        'role_id',
        'role_name',
      );
      if (!roleEntity) {
        throw new Error(
          `Role not found with ${typeof role === 'number' ? 'ID' : 'name'}: ${role}`,
        );
      }
      user.role = roleEntity;
    }

    // ตรวจสอบและอัปเดต Faculty
    if (faculty) {
      const facultyEntity = await this.getEntityByIdOrName(
        this.facultyRepository,
        faculty,
        'faculty_id',
        'faculty_name',
      );
      if (!facultyEntity) {
        throw new Error(
          `Faculty not found with ${typeof faculty === 'number' ? 'ID' : 'name'}: ${faculty}`,
        );
      }
      user.faculty = facultyEntity;
    }

    // ตรวจสอบและอัปเดต Department
    if (department) {
      const departmentEntity = await this.getEntityByIdOrName(
        this.departmentRepository,
        department,
        'department_id',
        'department_name',
      );
      if (!departmentEntity) {
        throw new Error(
          `Department not found with ${typeof department === 'number' ? 'ID' : 'name'}: ${department}`,
        );
      }
      user.department = departmentEntity;
    }

    // หากมีการส่งรหัสผ่านใหม่มา ต้องแฮชรหัสผ่านก่อนอัปเดต
    if (user_password) {
      user.user_password = await bcrypt.hash(user_password, 10);
    }

    // อัปเดตข้อมูลที่เหลือ
    Object.assign(user, userData);

    // บันทึกข้อมูล
    return this.userRepository.save(user);
  }

  private async getEntityByIdOrName<T>(
    repository: Repository<T>,
    identifier: number | string,
    idField: keyof T,
    nameField: keyof T,
  ): Promise<T | null> {
    if (typeof identifier === 'number') {
      return repository.findOne({
        where: { [idField]: identifier } as FindOptionsWhere<T>,
      });
    } else if (typeof identifier === 'string') {
      return repository.findOne({
        where: { [nameField]: identifier } as FindOptionsWhere<T>,
      });
    }
    return null;
  }

  async remove(userId: number): Promise<void> {
    try {
      // ตรวจสอบว่าผู้ใช้มีอยู่จริง
      const user = await this.userRepository.findOne({
        where: { user_id: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      // ลบผู้ใช้
      await this.userRepository.delete(userId);
    } catch (error) {
      // จัดการข้อผิดพลาดอื่นๆ
      throw new BadRequestException(`Failed to delete user: ${error.message}`);
    }
  }
}
