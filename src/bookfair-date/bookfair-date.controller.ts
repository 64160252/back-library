import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookfairDateService } from './bookfair-date.service';
import { CreateBookfairDateDto } from './dto/create-bookfair-date.dto';
import { UpdateBookfairDateDto } from './dto/update-bookfair-date.dto';

@Controller('bookfair-date')
export class BookfairDateController {
  constructor(private readonly bookfairDateService: BookfairDateService) {}

  @Post()
  create(@Body() createBookfairDateDto: CreateBookfairDateDto) {
    return this.bookfairDateService.create(createBookfairDateDto);
  }

  @Get()
  findAll() {
    return this.bookfairDateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookfairDateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookfairDateDto: UpdateBookfairDateDto) {
    return this.bookfairDateService.update(+id, updateBookfairDateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookfairDateService.remove(+id);
  }
}
