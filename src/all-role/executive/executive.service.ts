import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Executive } from './entities/executive.entity'; // ควรมี entity สำหรับ Executive
import { CreateExecutiveDto } from './dto/create-executive.dto';
import { UpdateExecutiveDto } from './dto/update-executive.dto';
import { User } from 'src/user/entities/user.entity'; // ใช้ Repository ของ User

@Injectable()
export class ExecutiveService {
  constructor(
    @InjectRepository(Executive)
    private readonly executiveRepository: Repository<Executive>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // ใช้ Repository ของ User
  ) {}

  async create(createExecutiveDto: CreateExecutiveDto): Promise<Executive> {
    // เพิ่ม user หรือ properties อื่น ๆ ที่จำเป็น
    const executive = this.executiveRepository.create({
      ...createExecutiveDto, // รวมข้อมูลจาก DTO ที่ได้รับ
      user: { user_id: createExecutiveDto.user_id }, // ถ้าจำเป็นต้องเชื่อมโยงกับ User (ในกรณีนี้อาจเป็น ID)
      createdAt: new Date(), // เพิ่ม createdAt (หรือสามารถใช้ default value ได้ถ้ามีใน entity)
      updatedAt: new Date(), // เพิ่ม updatedAt (เช่นเดียวกัน)
    });

    return this.executiveRepository.save(executive);
  }

  // หา executive ทั้งหมด
  async findAll() {
    return await this.executiveRepository
      .createQueryBuilder('executive')
      .leftJoinAndSelect('executive.user', 'user') // เชื่อมโยง executive กับ user
      .select([
        'executive.executive_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .getMany();
  }

  // หา executive ตาม id
  async findOne(id: number) {
    return await this.executiveRepository
      .createQueryBuilder('executive')
      .leftJoinAndSelect('executive.user', 'user') // เชื่อมโยง executive กับ user
      .select([
        'executive.executive_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('executive.executive_id = :id', { id })
      .getOne();
  }

  // อัปเดตข้อมูล executive
  async update(id: number, updateExecutiveDto: UpdateExecutiveDto) {
    const executive = await this.executiveRepository.findOne({
      where: { executive_id: id },
      relations: ['user'],
    });
    if (!executive) {
      throw new NotFoundException(`Executive with id ${id} not found`);
    }

    // อัปเดตข้อมูล executive ด้วยข้อมูลใหม่จาก DTO
    const updatedExecutive = Object.assign(executive, updateExecutiveDto);
    return this.executiveRepository.save(updatedExecutive);
  }

  // ลบ executive
  async remove(id: number) {
    const executive = await this.executiveRepository.findOne({
      where: { executive_id: id },
      relations: ['user'],
    });
    if (!executive) {
      throw new NotFoundException(`Executive with id ${id} not found`);
    }
    return this.executiveRepository.remove(executive);
  }
}
