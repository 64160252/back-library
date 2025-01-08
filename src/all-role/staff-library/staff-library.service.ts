import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffLibrary } from './entities/staff-library.entity'; // Entity ของ StaffLibrary
import { CreateStaffLibraryDto } from './dto/create-staff-library.dto';
import { UpdateStaffLibraryDto } from './dto/update-staff-library.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StaffLibraryService {
  constructor(
    @InjectRepository(StaffLibrary)
    private readonly staffLibraryRepository: Repository<StaffLibrary>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createStaffLibraryDto: CreateStaffLibraryDto,
  ): Promise<StaffLibrary> {
    // เพิ่ม user หรือ properties อื่น ๆ ที่จำเป็น
    const staffLibrary = this.staffLibraryRepository.create({
      ...createStaffLibraryDto, // รวมข้อมูลจาก DTO ที่ได้รับ
      user: { user_id: createStaffLibraryDto.user_id }, // ถ้าจำเป็นต้องเชื่อมโยงกับ User (ในกรณีนี้อาจเป็น ID)
      createdAt: new Date(), // เพิ่ม createdAt (หรือสามารถใช้ default value ได้ถ้ามีใน entity)
      updatedAt: new Date(), // เพิ่ม updatedAt (เช่นเดียวกัน)
    });

    return this.staffLibraryRepository.save(staffLibrary);
  }

  // หา StaffLibrary ทั้งหมด
  async findAll() {
    return await this.staffLibraryRepository
      .createQueryBuilder('staffLibrary')
      .leftJoinAndSelect('staffLibrary.user', 'user')
      .select([
        'staffLibrary.staffs_library_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .getMany();
  }

  // หา StaffLibrary ตาม ID
  async findOne(id: number) {
    const staffLibrary = await this.staffLibraryRepository
      .createQueryBuilder('staffLibrary')
      .leftJoinAndSelect('staffLibrary.user', 'user')
      .select([
        'staffLibrary.staffs_library_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('staffLibrary.staffs_library_id = :id', { id })
      .getOne();

    if (!staffLibrary) {
      throw new NotFoundException(`StaffLibrary with id ${id} not found`);
    }

    return staffLibrary;
  }

  // อัปเดตข้อมูล StaffLibrary
  async update(id: number, updateStaffLibraryDto: UpdateStaffLibraryDto) {
    const staffLibrary = await this.staffLibraryRepository.findOne({
      where: { staffs_library_id: id },
      relations: ['user'],
    });

    if (!staffLibrary) {
      throw new NotFoundException(`StaffLibrary with id ${id} not found`);
    }

    // อัปเดตข้อมูล StaffLibrary ด้วยข้อมูลใหม่จาก DTO
    const updatedStaffLibrary = Object.assign(
      staffLibrary,
      updateStaffLibraryDto,
    );
    return this.staffLibraryRepository.save(updatedStaffLibrary);
  }

  // ลบ StaffLibrary
  async remove(id: number) {
    const staffLibrary = await this.staffLibraryRepository.findOne({
      where: { staffs_library_id: id },
      relations: ['user'],
    });

    if (!staffLibrary) {
      throw new NotFoundException(`StaffLibrary with id ${id} not found`);
    }

    return this.staffLibraryRepository.remove(staffLibrary);
  }
}
