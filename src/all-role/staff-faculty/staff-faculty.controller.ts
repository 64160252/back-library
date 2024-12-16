import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaffFacultyService } from './staff-faculty.service';
import { CreateStaffFacultyDto } from './dto/create-staff-faculty.dto';
import { UpdateStaffFacultyDto } from './dto/update-staff-faculty.dto';

@Controller('staff-faculty')
export class StaffFacultyController {
  constructor(private readonly staffFacultyService: StaffFacultyService) {}

  // @Post()
  // create(@Body() createStaffFacultyDto: CreateStaffFacultyDto) {
  //   return this.staffFacultyService.create(createStaffFacultyDto);
  // }

  @Get()
  findAll() {
    return this.staffFacultyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffFacultyService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStaffFacultyDto: UpdateStaffFacultyDto,
  ) {
    return this.staffFacultyService.update(+id, updateStaffFacultyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffFacultyService.remove(+id);
  }
}
