import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExecutivesService } from './executive.service';
import { CreateExecutiveDto } from './dto/create-executive.dto';
import { UpdateExecutiveDto } from './dto/update-executive.dto';

@Controller('executives')
export class ExecutivesController {
  constructor(private readonly executivesService: ExecutivesService) {}

  @Post()
  create(@Body() createExecutiveDto: CreateExecutiveDto) {
    return this.executivesService.create(createExecutiveDto);
  }

  @Get()
  findAll() {
    return this.executivesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.executivesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExecutiveDto: UpdateExecutiveDto,
  ) {
    return this.executivesService.update(+id, updateExecutiveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.executivesService.remove(+id);
  }
}
