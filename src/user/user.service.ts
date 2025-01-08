import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/role/entities/role.entity';
import axios from 'axios';
import * as bcrypt from 'bcryptjs';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Department } from 'src/department/entities/department.entity';
import { Student } from 'src/all-role/student/entities/student.entity';
import { Teacher } from 'src/all-role/teacher/entities/teacher.entity';
import { Executive } from 'src/all-role/executive/entities/executive.entity';
import { StaffLibrary } from 'src/all-role/staff-library/entities/staff-library.entity';
import { StaffFaculty } from 'src/all-role/staff-faculty/entities/staff-faculty.entity';
import { Store } from 'src/all-role/store/entities/store.entity';

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
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Executive)
    private readonly executiveRepository: Repository<Executive>,
    @InjectRepository(StaffLibrary)
    private readonly staffLibraryRepository: Repository<StaffLibrary>,
    @InjectRepository(StaffFaculty)
    private readonly staffFacultyRepository: Repository<StaffFaculty>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const {
      faculty,
      department,
      role,
      user_email,
      user_name,
      user_prefix,
      user_firstName,
      user_lastName,
      user_tel,
      position_name,
      management_position_name,
      user_password,
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
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user_password, saltRounds);

      // สร้าง User
      const user = this.userRepository.create({
        ...userData,
        user_email,
        user_name,
        user_prefix,
        user_firstName,
        user_lastName,
        user_tel,
        position_name,
        management_position_name,
        user_password: hashedPassword,
        faculty: facultyEntity,
        department: departmentEntity,
        role: roleEntity,
      });

      const savedUser = await this.userRepository.save(user);

      // บันทึกข้อมูลลงตาม role
      if (roleEntity.role_name === 'Student' || roleEntity.role_id === 1) {
        const student = this.studentRepository.create({
          user: savedUser, // เชื่อมโยงกับ User ที่สร้างไว้
        });

        await this.studentRepository.save(student);
      } else if (
        roleEntity.role_name === 'Teacher' ||
        roleEntity.role_id === 2
      ) {
        const teacher = this.teacherRepository.create({
          user: savedUser, // เชื่อมโยงกับ User ที่สร้างไว้
        });

        await this.teacherRepository.save(teacher);
      } else if (
        roleEntity.role_name === 'Executive' ||
        roleEntity.role_id === 3
      ) {
        const executive = this.executiveRepository.create({
          user: savedUser, // เชื่อมโยงกับ User ที่สร้างไว้
        });

        await this.executiveRepository.save(executive);
      } else if (
        roleEntity.role_name === 'StaffLibrary' ||
        roleEntity.role_id === 4
      ) {
        const staffLibrary = this.staffLibraryRepository.create({
          user: savedUser, // เชื่อมโยงกับ User ที่สร้างไว้
        });

        await this.staffLibraryRepository.save(staffLibrary);
      } else if (
        roleEntity.role_name === 'StaffFaculty' ||
        roleEntity.role_id === 5
      ) {
        const staffFaculty = this.staffFacultyRepository.create({
          user: savedUser, // เชื่อมโยงกับ User ที่สร้างไว้
        });

        await this.staffFacultyRepository.save(staffFaculty);
      } else if (roleEntity.role_name === 'Store' || roleEntity.role_id === 6) {
        const store = this.storeRepository.create({
          user: savedUser, // เชื่อมโยง User
          store_name: savedUser.user_name, // กำหนด store_name จาก user_name
        });

        const savedStore = await this.storeRepository.save(store);
        console.log('Store entity after save:', savedStore);
      }

      return savedUser;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new BadRequestException(`User creation failed: ${error.message}`);
    }
  }

  // async fetchUserData() {
  //   try {
  //     // ส่งคำขอไปยัง API ภายนอกพร้อมกับ Header
  //     const response = await axios.get(
  //       'https://info.lib.buu.ac.th/apilib/Persons/ShowPersons',
  //     );

  //     console.log('Data fetched:', response.data); // แสดงข้อมูลที่ได้รับ
  //     return response.data; // คืนค่าข้อมูลที่ได้รับ
  //   } catch (error) {
  //     if (error.response) {
  //       // หากมีข้อผิดพลาดจาก API
  //       console.error(
  //         'Error response:',
  //         error.response.status,
  //         error.response.data,
  //       );
  //       throw new Error('Failed to fetch data from API');
  //     } else if (error.request) {
  //       // หากไม่มีการตอบกลับจาก API
  //       console.error('No response received:', error.request);
  //       throw new Error('No response received from API');
  //     } else {
  //       // หากเกิดข้อผิดพลาดที่อื่น
  //       console.error('Request error:', error.message);
  //       throw new Error('Error in making request');
  //     }
  //   }
  // }

  // // ฟังก์ชันแมปข้อมูลจาก API เป็น CreateUserDto
  // mapApiResponseToUserDto(apiData): CreateUserDto[] {
  //   return apiData.map((user) => {
  //     const userDto = new CreateUserDto();
  //     userDto.user_prefix = user.Prefix_Name;
  //     userDto.user_firstName = user.Firstname;
  //     userDto.user_lastName = user.Lastname;
  //     userDto.user_name = user.Username;
  //     userDto.user_password = 'password';
  //     userDto.user_email = user.Email;
  //     userDto.user_tel = user.Phone;
  //     userDto.faculty = user.Department_Name; // แปลงข้อมูล Faculty
  //     userDto.department = user.Department_Name; // ถ้าใช้ Department Name เป็นค่าเดียวกันกับ Faculty
  //     userDto.position_name = user.Position_Name;
  //     userDto.management_position_name =
  //       user.ManagementPositionName.length > 0
  //         ? user.ManagementPositionName[0].ManagementPositionName
  //         : null;
  //     userDto.role = 'StaffLibrary'; // กำหนด role ตามต้องการ (หรือดึงจากข้อมูลอื่นที่คุณมี)

  //     return userDto;
  //   });
  // }

  // // ฟังก์ชันในการบันทึกข้อมูลผู้ใช้จาก API
  // async saveUsersFromApi() {
  //   const apiData = await this.fetchUserData(); // ดึงข้อมูลจาก API
  //   const usersToSave: CreateUserDto[] = this.mapApiResponseToUserDto(apiData); // แปลงข้อมูลเป็น DTO

  //   try {
  //     // บันทึกข้อมูลผู้ใช้ทีละคน
  //     for (const userDto of usersToSave) {
  //       await this.create(userDto); // บันทึกข้อมูลในฐานข้อมูล
  //     }
  //     console.log('Users saved successfully');
  //   } catch (error) {
  //     console.error('Error saving users:', error);
  //   }
  // }

  async findAll(): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.faculty', 'faculty')
      .leftJoinAndSelect('user.department', 'department')
      .select([
        'user.user_id',
        'user.user_name',
        'user.user_prefix',
        'user.user_firstName',
        'user.user_lastName',
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
        'user.user_prefix',
        'user.user_firstName',
        'user.user_lastName',
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

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { user_name: username },
      relations: ['role'],
    });
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
    const user = await this.userRepository.findOneBy({ user_id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
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
        throw new BadRequestException(
          `Role not found with ID or name: ${role}`,
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
        throw new BadRequestException(
          `Faculty not found with ID or name: ${faculty}`,
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
        throw new BadRequestException(
          `Department not found with ID or name: ${department}`,
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
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      console.error(`Error saving user: ${error.message}`);
      throw new InternalServerErrorException(
        `Failed to save user: ${error.message}`,
      );
    }
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
