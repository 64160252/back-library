import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>, // ใช้ Repository ของ Store
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // ใช้ Repository ของ User
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    // ดึงข้อมูล User ที่เชื่อมโยงด้วย user_id
    const user = await this.userRepository.findOne({
      where: { user_id: createStoreDto.user_id },
    });

    if (!user) {
      throw new NotFoundException(
        `User with id ${createStoreDto.user_id} not found`,
      );
    }

    console.log('User name to be used for store_name:', user.user_name);

    const store = this.storeRepository.create({
      user, // เชื่อมโยงกับ User
      store_name: user.user_name, // ใช้ user_name ของ User
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Store entity before save:', store);

    return this.storeRepository.save(store);
  }

  // ค้นหาทุก store
  async findAll() {
    return await this.storeRepository
      .createQueryBuilder('store') // เปลี่ยนเป็น 'student' แทน 'user'
      .leftJoinAndSelect('store.user', 'user') // เชื่อมโยง student กับ user
      .select([
        'store.store_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .getMany();
  }

  async findOne(id: number) {
    return await this.storeRepository
      .createQueryBuilder('store') // เปลี่ยนเป็น 'student' แทน 'user'
      .leftJoinAndSelect('store.user', 'user') // เชื่อมโยง student กับ user
      .select([
        'store.store_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('store.store_id = :id', { id }) // กำหนดเงื่อนไขการค้นหาด้วย student_id
      .getOne();
  }

  // อัปเดต store
  async update(id: number, updateStoreDto: UpdateStoreDto) {
    const store = await this.storeRepository.findOne({
      where: { store_id: id },
    });
    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }

    // อัปเดตข้อมูล store
    const updatedStore = Object.assign(store, updateStoreDto);
    return await this.storeRepository.save(updatedStore);
  }

  // ลบ store
  async remove(id: number) {
    const store = await this.storeRepository.findOne({
      where: { store_id: id },
    });
    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }
    return await this.storeRepository.remove(store);
  }
}
