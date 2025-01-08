import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Store } from './entities/store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, User])], // เชื่อมโยง Repository
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService], // ส่งออก UserService ให้โมดูลอื่นใช้ได้
})
export class StoreModule {}
