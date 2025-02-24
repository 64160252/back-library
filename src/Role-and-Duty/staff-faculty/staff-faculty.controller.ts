import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaffsFacultyService } from './staff-faculty.service';
import { CreateStaffFacultyDto } from './dto/create-staff-faculty.dto';
import { UpdateStaffFacultyDto } from './dto/update-staff-faculty.dto';

@Controller('staffs-faculty')
export class StaffsFacultyController {
  constructor(private readonly staffsFacultyService: StaffsFacultyService) {}

  @Post()
  create(@Body() createStaffFacultyDto: CreateStaffFacultyDto) {
    return this.staffsFacultyService.create(createStaffFacultyDto);
  }

  @Get()
  findAll() {
    return this.staffsFacultyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffsFacultyService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStaffFacultyDto: UpdateStaffFacultyDto,
  ) {
    return this.staffsFacultyService.update(+id, updateStaffFacultyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffsFacultyService.remove(+id);
  }
}
