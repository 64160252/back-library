import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffLibraryAdm } from './entities/staff-library-adm.entity'; // ควรมี Entity สำหรับ StaffLibraryAdm
import { CreateStaffLibraryAdmDto } from './dto/create-staff-library-adm.dto';
import { UpdateStaffLibraryAdmDto } from './dto/update-staff-library-adm.dto';
import { User } from 'src/user/entities/user.entity'; // ใช้ Repository ของ User

@Injectable()
export class StaffLibraryAdmService {
  constructor(
    @InjectRepository(StaffLibraryAdm)
    private readonly staffLibraryAdmRepository: Repository<StaffLibraryAdm>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // ใช้ Repository ของ User
  ) {}

  // สร้าง StaffLibraryAdm
  async create(createStaffLibraryAdmDto: CreateStaffLibraryAdmDto) {
    const { user_id } = createStaffLibraryAdmDto;

    // ตรวจสอบว่า User มีอยู่หรือไม่
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ตรวจสอบว่า User เชื่อมโยงกับ StaffLibraryAdm หรือไม่
    const existingStaff = await this.staffLibraryAdmRepository.findOne({
      where: { user: { user_id } },
    });

    if (existingStaff) {
      throw new BadRequestException(
        'This user is already linked to a StaffLibraryAdm',
      );
    }

    // ถ้าไม่มีการเชื่อมโยงใด ๆ ก็สร้าง StaffLibraryAdm ใหม่
    const staffLibraryAdm = this.staffLibraryAdmRepository.create({
      user,
    });

    // บันทึกข้อมูล StaffLibraryAdm ใน database
    return await this.staffLibraryAdmRepository.save(staffLibraryAdm);
  }

  // หา StaffLibraryAdm ทั้งหมด
  async findAll() {
    return await this.staffLibraryAdmRepository
      .createQueryBuilder('staffLibraryAdm')
      .leftJoinAndSelect('staffLibraryAdm.user', 'user') // เชื่อมโยง staffLibraryAdm กับ user
      .select([
        'staffLibraryAdm.staffs_library_adm_id',
        'staffLibraryAdm.faculty_id',
        'staffLibraryAdm.department_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .getMany();
  }

  // หา StaffLibraryAdm ตาม id
  async findOne(id: number) {
    const staffLibraryAdm = await this.staffLibraryAdmRepository
      .createQueryBuilder('staffLibraryAdm')
      .leftJoinAndSelect('staffLibraryAdm.user', 'user') // เชื่อมโยง staffLibraryAdm กับ user
      .select([
        'staffLibraryAdm.staffs_library_adm_id',
        'staffLibraryAdm.faculty_id',
        'staffLibraryAdm.department_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('staffLibraryAdm.staffs_library_adm_id = :id', { id })
      .getOne();

    if (!staffLibraryAdm) {
      throw new NotFoundException(`StaffLibraryAdm with id ${id} not found`);
    }

    return staffLibraryAdm;
  }

  // อัปเดตข้อมูล StaffLibraryAdm
  async update(id: number, updateStaffLibraryAdmDto: UpdateStaffLibraryAdmDto) {
    const staffLibraryAdm = await this.staffLibraryAdmRepository.findOne({
      where: { staffs_library_adm_id: id },
      relations: ['user'],
    });
    if (!staffLibraryAdm) {
      throw new NotFoundException(`StaffLibraryAdm with id ${id} not found`);
    }

    // อัปเดตข้อมูล staffLibraryAdm ด้วยข้อมูลใหม่จาก DTO
    const updatedStaff = Object.assign(
      staffLibraryAdm,
      updateStaffLibraryAdmDto,
    );
    return this.staffLibraryAdmRepository.save(updatedStaff);
  }

  // ลบ StaffLibraryAdm
  async remove(id: number) {
    const staffLibraryAdm = await this.staffLibraryAdmRepository.findOne({
      where: { staffs_library_adm_id: id },
      relations: ['user'],
    });
    if (!staffLibraryAdm) {
      throw new NotFoundException(`StaffLibraryAdm with id ${id} not found`);
    }
    return this.staffLibraryAdmRepository.remove(staffLibraryAdm);
  }
}
