import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])], // เชื่อมโยง Repository
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService], // ส่งออก UserService ให้โมดูลอื่นใช้ได้
})
export class RoleModule {}
