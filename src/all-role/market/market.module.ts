import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { Market } from './entities/market.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Market, User])], // เชื่อมโยง Repository
  controllers: [MarketController],
  providers: [MarketService],
  exports: [MarketService], // ส่งออก UserService ให้โมดูลอื่นใช้ได้
})
export class MarketModule {}
