import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // ฟังก์ชันสร้าง ตำแหน่ง
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const role = this.roleRepository.create(createRoleDto);

      const savedRole = await this.roleRepository.save(role);
      return savedRole;
    } catch (error) {
      throw new BadRequestException(`Faculty role failed: ${error.message}`);
    }
  }

  // ฟังก์ชันค้นหา ตำแหน่ง ทั้งหมด
  async findAll(): Promise<Role[]> {
    return await this.roleRepository.createQueryBuilder('roles').getMany();
  }

  // ฟังก์ชันค้นหา ตำแหน่ง ตาม id
  async findOne(id: number): Promise<Role> {
    return await this.roleRepository
      .createQueryBuilder('roles')
      .where('faculties.faculty_id = :id', { id })
      .getOne();
  }

  // ฟังก์ชันแก้ไข ตำแหน่ง
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({
        where: { role_id: id },
      });
      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      const updatedRole = Object.assign(role, updateRoleDto);
      return this.roleRepository.save(updatedRole);
    } catch (error) {
      throw new BadRequestException(`Failed to update Role: ${error.message}`);
    }
  }

  // ฟังก์ชันลบ ตำแหน่ง
  async remove(id: number): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({
        where: { role_id: id },
      });
      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found.`);
      }
      const deletedRole = Object.assign(role, UpdateRoleDto);
      return this.roleRepository.remove(deletedRole);
    } catch (error) {
      throw new BadRequestException(`Failed to delete Role: ${error.message}`);
    }
  }
}
