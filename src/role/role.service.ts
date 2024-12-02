import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto); // สร้าง Role entity
    return this.roleRepository.save(role); // บันทึกลงฐานข้อมูล
  }

  // Find all roles with users
  async findAll() {
    return await this.roleRepository.createQueryBuilder('role').getMany();
  }

  // Find a single role with its users
  async findOne(id: number): Promise<Role> {
    return await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.users', 'user') // เชื่อมโยงกับ user
      .select([
        'role.role_id',
        'role.role_name',
        'user.user_id',
        'user.user_name',
      ])
      .where('role.role_id = :id', { id })
      .getOne();
  }

  // Update Role
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { role_id: id } });
    if (!role) {
      throw new Error(`Role with ID ${id} not found`);
    }

    Object.assign(role, updateRoleDto); // อัพเดตข้อมูล role
    return this.roleRepository.save(role); // บันทึกข้อมูลที่อัพเดต
  }

  // Remove Role
  async remove(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }
}
