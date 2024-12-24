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

  async create(
    createStaffFacultyDto: CreateStaffFacultyDto,
  ): Promise<StaffFaculty> {
    // เพิ่ม user หรือ properties อื่น ๆ ที่จำเป็น
    const staffFaculty = this.staffFacultyRepository.create({
      ...createStaffFacultyDto, // รวมข้อมูลจาก DTO ที่ได้รับ
      user: { user_id: createStaffFacultyDto.user_id }, // ถ้าจำเป็นต้องเชื่อมโยงกับ User (ในกรณีนี้อาจเป็น ID)
      createdAt: new Date(), // เพิ่ม createdAt (หรือสามารถใช้ default value ได้ถ้ามีใน entity)
      updatedAt: new Date(), // เพิ่ม updatedAt (เช่นเดียวกัน)
    });

    return this.staffFacultyRepository.save(staffFaculty);
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
