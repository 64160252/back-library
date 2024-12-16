import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExecutiveService } from './executive.service';
import { CreateExecutiveDto } from './dto/create-executive.dto';
import { UpdateExecutiveDto } from './dto/update-executive.dto';

@Controller('executive')
export class ExecutiveController {
  constructor(private readonly executiveService: ExecutiveService) {}

  // @Post()
  // create(@Body() createExecutiveDto: CreateExecutiveDto) {
  //   return this.executiveService.create(createExecutiveDto);
  // }

  @Get()
  findAll() {
    return this.executiveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.executiveService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExecutiveDto: UpdateExecutiveDto,
  ) {
    return this.executiveService.update(+id, updateExecutiveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.executiveService.remove(+id);
  }
}
