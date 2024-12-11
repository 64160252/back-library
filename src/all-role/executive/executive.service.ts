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

  // สร้าง executive
  async create(createExecutiveDto: CreateExecutiveDto) {
    const { user_id } = createExecutiveDto;

    // ตรวจสอบว่า User มีอยู่หรือไม่
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ตรวจสอบว่า User เชื่อมโยงกับ Executive หรือไม่
    const existingExecutive = await this.executiveRepository.findOne({
      where: { user: { user_id } },
    });

    if (existingExecutive) {
      throw new BadRequestException(
        'This user is already linked to an Executive',
      );
    }

    // ถ้าไม่มีการเชื่อมโยงใด ๆ ก็สร้าง Executive ใหม่
    const executive = this.executiveRepository.create({
      user,
    });

    // บันทึกข้อมูล executive ใน database
    return await this.executiveRepository.save(executive);
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
