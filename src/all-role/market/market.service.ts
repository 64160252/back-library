import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Market } from './entities/market.entity';
import { CreateMarketDto } from './dto/create-market.dto';
import { UpdateMarketDto } from './dto/update-market.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(Market)
    private readonly marketRepository: Repository<Market>, // ใช้ Repository ของ Market
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // ใช้ Repository ของ User
  ) {}

  // สร้าง market
  async create(createMarketDto: CreateMarketDto) {
    // ค้นหาข้อมูล user ที่มี user_id ที่ตรงกับที่ได้รับมา
    const user = await this.userRepository.findOne({
      where: { user_id: createMarketDto.user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // สร้าง student ด้วยข้อมูลที่ได้รับมา
    const market = this.marketRepository.create({
      user, // เชื่อมโยงกับ user
    });

    // บันทึกข้อมูล student ใน database
    return await this.marketRepository.save(market);
  }

  // ค้นหาทุก market
  async findAll() {
    return await this.marketRepository
      .createQueryBuilder('market') // เปลี่ยนเป็น 'student' แทน 'user'
      .leftJoinAndSelect('market.user', 'user') // เชื่อมโยง student กับ user
      .select([
        'market.market_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .getMany();
  }

  async findOne(id: number) {
    return await this.marketRepository
      .createQueryBuilder('market') // เปลี่ยนเป็น 'student' แทน 'user'
      .leftJoinAndSelect('market.user', 'user') // เชื่อมโยง student กับ user
      .select([
        'market.market_id',
        'user.user_id',
        'user.user_name',
        'user.user_email',
        'user.user_tel',
      ])
      .where('market.market_id = :id', { id }) // กำหนดเงื่อนไขการค้นหาด้วย student_id
      .getOne();
  }

  // อัปเดต market
  async update(id: number, updateMarketDto: UpdateMarketDto) {
    const market = await this.marketRepository.findOne({
      where: { market_id: id },
    });
    if (!market) {
      throw new NotFoundException(`Market with id ${id} not found`);
    }

    // อัปเดตข้อมูล market
    const updatedMarket = Object.assign(market, updateMarketDto);
    return await this.marketRepository.save(updatedMarket);
  }

  // ลบ market
  async remove(id: number) {
    const market = await this.marketRepository.findOne({
      where: { market_id: id },
    });
    if (!market) {
      throw new NotFoundException(`Market with id ${id} not found`);
    }
    return await this.marketRepository.remove(market);
  }
}
