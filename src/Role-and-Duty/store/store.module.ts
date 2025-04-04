import { Module } from '@nestjs/common';
import { StoresService } from './store.service';
import { StoresController } from './store.controller';
import { Store } from './entities/store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Book } from 'src/books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, User, Role, Book])],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoreModule {}
