import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExecutiveDto } from './dto/create-executive.dto';
import { UpdateExecutiveDto } from './dto/update-executive.dto';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { Executive } from './entities/executive.entity';

@Injectable()
export class ExecutivesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Executive)
    private readonly executiveRepository: Repository<Executive>,
  ) {}

  // ฟังก์ชันสร้าง ผู้ใช้งาน (ผู้อำนวยการ)
  async create(createExecutiveDto: CreateExecutiveDto): Promise<Executive> {
    const {
      user_email,
      user_name,
      user_password,
      user_tel,
      user_prefix,
      user_firstName,
      user_lastName,
      duty_name,
      ...executiveData
    } = createExecutiveDto;

    try {
      const role_id = 1;

      const roleEntity = await this.roleRepository.findOne({
        where: { role_id },
      });

      const lastUser = await this.userRepository
        .createQueryBuilder('user')
        .where('user.user_id LIKE :pattern', { pattern: `${role_id}%` })
        .orderBy('user.user_id', 'DESC')
        .getOne();

      const newUserId = parseInt(
        `${role_id}${(
          (lastUser ? parseInt(lastUser.user_id.toString().slice(-5)) : 0) + 1
        )
          .toString()
          .padStart(5, '0')}`,
      );

      const hashedPassword = await bcrypt.hash(user_password, 10);

      const user = this.userRepository.create({
        user_id: newUserId,
        user_email,
        user_name,
        user_password: hashedPassword,
        user_tel,
        role: roleEntity,
        role_name: roleEntity.role_name,
      });
      const savedUser = await this.userRepository.save(user);

      const executive = this.executiveRepository.create({
        ...executiveData,
        user: savedUser,
        user_prefix,
        user_firstName,
        user_lastName,
        duty_name,
      });

      return await this.executiveRepository.save(executive);
    } catch (error) {
      if (error) {
        await this.userRepository.delete({
          user_name: createExecutiveDto.user_name,
        });
      }
      throw new BadRequestException(
        `StaffLibrary creation failed: ${error.message}`,
      );
    }
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ทั้งหมด (ผู้อำนวยการ)
  async findAll() {
    return await this.executiveRepository
      .createQueryBuilder('executive')
      .leftJoinAndSelect('executive.user', 'user')
      .select([
        'executive.executives_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .getMany();
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ตาม id (ผู้อำนวยการ)
  async findOne(id: number) {
    return await this.executiveRepository
      .createQueryBuilder('executive')
      .leftJoinAndSelect('executive.user', 'user')
      .select([
        'executive.executives_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('executive.executives_id = :id', { id })
      .getOne();
  }

  // ฟังก์ชันแก้ไข ผู้ใช้งาน (ผู้อำนวยการ)
  async update(id: number, updateExecutiveDto: UpdateExecutiveDto) {
    const executive = await this.executiveRepository.findOne({
      where: { executives_id: id },
      relations: ['user'],
    });
    if (!executive) {
      throw new NotFoundException(`Executive with id ${id} not found`);
    }

    const updatedExecutive = Object.assign(executive, updateExecutiveDto);
    return this.executiveRepository.save(updatedExecutive);
  }

  // ฟังก์ชันลบ ผู้ใช้งาน (ผู้อำนวยการ)
  async remove(id: number) {
    const executive = await this.executiveRepository.findOne({
      where: { executives_id: id },
      relations: ['user'],
    });
    if (!executive) {
      throw new NotFoundException(`Executive with id ${id} not found`);
    }
    return this.executiveRepository.remove(executive);
  }
}
