import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  // สร้าง StaffLibraryNor
  async create(createStaffLibraryNorDto: CreateStaffLibraryNorDto) {
    const { user_id } = createStaffLibraryNorDto;

    // ตรวจสอบว่า User มีอยู่หรือไม่
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ตรวจสอบว่า User เชื่อมโยงกับ StaffLibraryNor หรือไม่
    const existingStaff = await this.staffLibraryNorRepository.findOne({
      where: { user: { user_id } },
    });

    if (existingStaff) {
      throw new BadRequestException(
        'This user is already linked to a StaffLibraryNor',
      );
    }

    // ถ้าไม่มีการเชื่อมโยงใด ๆ ก็สร้าง StaffLibraryNor ใหม่
    const staffLibraryNor = this.staffLibraryNorRepository.create({
      user,
    });

    // บันทึกข้อมูล StaffLibraryNor ในฐานข้อมูล
    return await this.staffLibraryNorRepository.save(staffLibraryNor);
  }

  // หา StaffLibraryNor ทั้งหมด
  async findAll() {
    return await this.staffLibraryNorRepository
      .createQueryBuilder('staffLibraryNor')
      .leftJoinAndSelect('staffLibraryNor.user', 'user')
      .select([
        'staffLibraryNor.staffs_library_nor_id',
        'staffLibraryNor.faculty_id',
        'staffLibraryNor.department_id',
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
        'staffLibraryNor.faculty_id',
        'staffLibraryNor.department_id',
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
