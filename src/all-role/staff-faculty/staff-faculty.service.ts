import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffFaculty } from './entities/staff-faculty.entity';
import { CreateStaffFacultyDto } from './dto/create-staff-faculty.dto';
import { UpdateStaffFacultyDto } from './dto/update-staff-faculty.dto';
import { User } from 'src/user/entities/user.entity'; // สมมติว่าเรามี User ที่เชื่อมโยงกับ staffFaculty

@Injectable()
export class StaffFacultyService {
  constructor(
    @InjectRepository(StaffFaculty)
    private readonly staffFacultyRepository: Repository<StaffFaculty>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // เชื่อมโยงกับ User
  ) {}

  // สร้าง staffFaculty
  async create(createStaffFacultyDto: CreateStaffFacultyDto) {
    const { user_id } = createStaffFacultyDto;

    // ค้นหาข้อมูล user ที่มี user_id
    const user = await this.userRepository.findOne({
      where: { user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // สร้าง staffFaculty ด้วยข้อมูลที่ได้รับมา
    const staffFaculty = this.staffFacultyRepository.create({
      user, // เชื่อมโยงกับ user
      ...createStaffFacultyDto, // ใช้ข้อมูล DTO ที่ได้รับมา
    });

    // บันทึกข้อมูล staffFaculty
    return await this.staffFacultyRepository.save(staffFaculty);
  }

  // ค้นหาทุก staffFaculty
  async findAll() {
    return await this.staffFacultyRepository
      .createQueryBuilder('staffFaculty')
      .leftJoinAndSelect('staffFaculty.user', 'user') // เชื่อมโยง staffFaculty กับ user
      .select([
        'staffFaculty.staff_faculty_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
      ])
      .getMany();
  }

  // ค้นหา staffFaculty ตาม id
  async findOne(id: number) {
    const staffFaculty = await this.staffFacultyRepository
      .createQueryBuilder('staffFaculty')
      .leftJoinAndSelect('staffFaculty.user', 'user')
      .select([
        'staffFaculty.staff_faculty_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
      ])
      .where('staffFaculty.staff_faculty_id = :id', { id })
      .getOne();

    if (!staffFaculty) {
      throw new NotFoundException(`StaffFaculty with id ${id} not found`);
    }

    return staffFaculty;
  }

  // อัปเดตข้อมูล staffFaculty
  async update(id: number, updateStaffFacultyDto: UpdateStaffFacultyDto) {
    const staffFaculty = await this.staffFacultyRepository.findOne({
      where: { staff_faculty_id: id },
    });

    if (!staffFaculty) {
      throw new NotFoundException(`StaffFaculty with id ${id} not found`);
    }

    // อัปเดตข้อมูล staffFaculty ด้วยข้อมูลจาก DTO
    const updatedStaffFaculty = Object.assign(
      staffFaculty,
      updateStaffFacultyDto,
    );
    return await this.staffFacultyRepository.save(updatedStaffFaculty);
  }

  // ลบ staffFaculty
  async remove(id: number) {
    const staffFaculty = await this.staffFacultyRepository.findOne({
      where: { staff_faculty_id: id },
    });

    if (!staffFaculty) {
      throw new NotFoundException(`StaffFaculty with id ${id} not found`);
    }

    return await this.staffFacultyRepository.remove(staffFaculty);
  }
}
