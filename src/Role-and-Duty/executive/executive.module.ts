import { Module } from '@nestjs/common';
import { ExecutivesService } from './executive.service';
import { ExecutivesController } from './executive.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { Executive } from './entities/executive.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Executive, User, Role])],
  controllers: [ExecutivesController],
  providers: [ExecutivesService],
  exports: [ExecutivesService],
})
export class ExecutiveModule {}
