import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // async findOne(id: number): Promise<User> {
  //   return await this.userRepository.findOne(id);
  // }

  // async update(id: number, updateUserDto: CreateUserDto): Promise<User> {
  //   await this.userRepository.update(id, updateUserDto);
  //   return this.findOne(id);
  // }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
