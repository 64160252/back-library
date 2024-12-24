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

  async create(
    createStaffLibraryAdmDto: CreateStaffLibraryAdmDto,
  ): Promise<StaffLibraryAdm> {
    // เพิ่ม user หรือ properties อื่น ๆ ที่จำเป็น
    const staffLibraryAdm = this.staffLibraryAdmRepository.create({
      ...createStaffLibraryAdmDto, // รวมข้อมูลจาก DTO ที่ได้รับ
      user: { user_id: createStaffLibraryAdmDto.user_id }, // ถ้าจำเป็นต้องเชื่อมโยงกับ User (ในกรณีนี้อาจเป็น ID)
      createdAt: new Date(), // เพิ่ม createdAt (หรือสามารถใช้ default value ได้ถ้ามีใน entity)
      updatedAt: new Date(), // เพิ่ม updatedAt (เช่นเดียวกัน)
    });

    return this.staffLibraryAdmRepository.save(staffLibraryAdm);
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
