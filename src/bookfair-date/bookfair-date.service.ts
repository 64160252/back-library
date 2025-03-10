import { Injectable } from '@nestjs/common';
import { CreateBookfairDateDto } from './dto/create-bookfair-date.dto';
import { UpdateBookfairDateDto } from './dto/update-bookfair-date.dto';

@Injectable()
export class BookfairDateService {
  create(createBookfairDateDto: CreateBookfairDateDto) {
    return 'This action adds a new bookfairDate';
  }

  findAll() {
    return `This action returns all bookfairDate`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookfairDate`;
  }

  update(id: number, updateBookfairDateDto: UpdateBookfairDateDto) {
    return `This action updates a #${id} bookfairDate`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookfairDate`;
  }
}
