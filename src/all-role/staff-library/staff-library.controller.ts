import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaffLibraryService } from './staff-library.service';
import { CreateStaffLibraryDto } from './dto/create-staff-library.dto';
import { UpdateStaffLibraryDto } from './dto/update-staff-library.dto';

@Controller('staff-library-nor')
export class StaffLibraryController {
  constructor(private readonly staffLibraryService: StaffLibraryService) {}

  @Post()
  create(@Body() createStaffLibraryDto: CreateStaffLibraryDto) {
    return this.staffLibraryService.create(createStaffLibraryDto);
  }

  @Get()
  findAll() {
    return this.staffLibraryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffLibraryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStaffLibraryDto: UpdateStaffLibraryDto,
  ) {
    return this.staffLibraryService.update(+id, updateStaffLibraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffLibraryService.remove(+id);
  }
}
