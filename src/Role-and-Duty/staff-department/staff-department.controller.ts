import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaffsDepartmentService } from './staff-department.service';
import { CreateStaffDepartmentDto } from './dto/create-staff-department.dto';
import { UpdateStaffDepartmentDto } from './dto/update-staff-department.dto';

@Controller('staffs-department')
export class StaffsDepartmentController {
  constructor(
    private readonly staffsDepartmentService: StaffsDepartmentService,
  ) {}

  @Post()
  create(@Body() createStaffDepartmentDto: CreateStaffDepartmentDto) {
    return this.staffsDepartmentService.create(createStaffDepartmentDto);
  }

  @Get()
  findAll() {
    return this.staffsDepartmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffsDepartmentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStaffDepartmentDto: UpdateStaffDepartmentDto,
  ) {
    return this.staffsDepartmentService.update(+id, updateStaffDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffsDepartmentService.remove(+id);
  }
}
