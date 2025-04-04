import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  // ฟังก์ชันสร้าง ผู้ใช้งาน (ร้านค้า)
  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const {
      user_email,
      user_name,
      user_password,
      user_tel,
      store_name,
      ...storeData
    } = createStoreDto;

    try {
      const role_id = 8;

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

      const store = this.storeRepository.create({
        ...storeData,
        user: savedUser,
        store_name,
      });

      return await this.storeRepository.save(store);
    } catch (error) {
      if (error) {
        await this.userRepository.delete({
          user_name: createStoreDto.user_name,
        });
      }
      throw new BadRequestException(`Store creation failed: ${error.message}`);
    }
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ทั้งหมด (ร้านค้า)
  async findAll() {
    return await this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.user', 'user')
      .leftJoinAndSelect('store.books', 'book')
      .select([
        'store.store_id',
        'store.store_name',
        'book.book_id',
        'book.ISBN',
        'book.book_title',
        'book.book_author',
        'book.book_price',
        'book.book_category',
        'book.book_published',
        'book.book_volumn',
        'book.book_description',
        'book.book_status',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .getMany();
  }

  // ฟังก์ชันค้นหา ผู้ใช้งาน ตาม id (ร้านค้า)
  async findOne(id: number) {
    return await this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.user', 'user')
      .leftJoinAndSelect('store.books', 'book')
      .select([
        'store.store_id',
        'store.store_name',
        'book.book_id',
        'book.ISBN',
        'book.book_title',
        'book.book_author',
        'book.book_price',
        'book.book_category',
        'book.book_published',
        'book.book_volumn',
        'book.book_description',
        'book.book_status',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('store.store_id = :id', { id })
      .getOne();
  }

  // ฟังก์ชันแก้ไข ผู้ใช้งาน (ร้านค้า)
  async update(id: number, updateStoreDto: UpdateStoreDto) {
    const store = await this.storeRepository.findOne({
      where: { store_id: id },
      relations: ['user'],
    });
    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }

    const updatedstore = Object.assign(store, updateStoreDto);
    return this.storeRepository.save(updatedstore);
  }

  // ฟังก์ชันลบ ผู้ใช้งาน (ร้านค้า)
  async remove(id: number) {
    const store = await this.storeRepository.findOne({
      where: { store_id: id },
      relations: ['user'],
    });
    if (!store) {
      throw new NotFoundException(`Store with id ${id} not found`);
    }
    return this.storeRepository.remove(store);
  }
}
