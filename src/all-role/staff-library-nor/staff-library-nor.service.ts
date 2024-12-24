import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffLibraryNor } from './entities/staff-library-nor.entity'; // Entity ของ StaffLibraryNor
import { CreateStaffLibraryNorDto } from './dto/create-staff-library-nor.dto';
import { UpdateStaffLibraryNorDto } from './dto/update-staff-library-nor.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StaffLibraryNorService {
  constructor(
    @InjectRepository(StaffLibraryNor)
    private readonly staffLibraryNorRepository: Repository<StaffLibraryNor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createStaffLibraryNorDto: CreateStaffLibraryNorDto,
  ): Promise<StaffLibraryNor> {
    // เพิ่ม user หรือ properties อื่น ๆ ที่จำเป็น
    const staffLibraryNor = this.staffLibraryNorRepository.create({
      ...createStaffLibraryNorDto, // รวมข้อมูลจาก DTO ที่ได้รับ
      user: { user_id: createStaffLibraryNorDto.user_id }, // ถ้าจำเป็นต้องเชื่อมโยงกับ User (ในกรณีนี้อาจเป็น ID)
      createdAt: new Date(), // เพิ่ม createdAt (หรือสามารถใช้ default value ได้ถ้ามีใน entity)
      updatedAt: new Date(), // เพิ่ม updatedAt (เช่นเดียวกัน)
    });

    return this.staffLibraryNorRepository.save(staffLibraryNor);
  }

  // หา StaffLibraryNor ทั้งหมด
  async findAll() {
    return await this.staffLibraryNorRepository
      .createQueryBuilder('staffLibraryNor')
      .leftJoinAndSelect('staffLibraryNor.user', 'user')
      .select([
        'staffLibraryNor.staffs_library_nor_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .getMany();
  }

  // หา StaffLibraryNor ตาม ID
  async findOne(id: number) {
    const staffLibraryNor = await this.staffLibraryNorRepository
      .createQueryBuilder('staffLibraryNor')
      .leftJoinAndSelect('staffLibraryNor.user', 'user')
      .select([
        'staffLibraryNor.staffs_library_nor_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('staffLibraryNor.staffs_library_nor_id = :id', { id })
      .getOne();

    if (!staffLibraryNor) {
      throw new NotFoundException(`StaffLibraryNor with id ${id} not found`);
    }

    return staffLibraryNor;
  }

  // อัปเดตข้อมูล StaffLibraryNor
  async update(id: number, updateStaffLibraryNorDto: UpdateStaffLibraryNorDto) {
    const staffLibraryNor = await this.staffLibraryNorRepository.findOne({
      where: { staffs_library_nor_id: id },
      relations: ['user'],
    });

    if (!staffLibraryNor) {
      throw new NotFoundException(`StaffLibraryNor with id ${id} not found`);
    }

    // อัปเดตข้อมูล StaffLibraryNor ด้วยข้อมูลใหม่จาก DTO
    const updatedStaffLibraryNor = Object.assign(
      staffLibraryNor,
      updateStaffLibraryNorDto,
    );
    return this.staffLibraryNorRepository.save(updatedStaffLibraryNor);
  }

  // ลบ StaffLibraryNor
  async remove(id: number) {
    const staffLibraryNor = await this.staffLibraryNorRepository.findOne({
      where: { staffs_library_nor_id: id },
      relations: ['user'],
    });

    if (!staffLibraryNor) {
      throw new NotFoundException(`StaffLibraryNor with id ${id} not found`);
    }

    return this.staffLibraryNorRepository.remove(staffLibraryNor);
  }
}
