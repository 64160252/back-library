import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaffsLibraryService } from './staff-library.service';
import { CreateStaffLibraryDto } from './dto/create-staff-library.dto';
import { UpdateStaffLibraryDto } from './dto/update-staff-library.dto';

@Controller('staffs-library')
export class StaffsLibraryController {
  constructor(private readonly staffsLibraryService: StaffsLibraryService) {}

  @Post()
  create(@Body() createStaffLibraryDto: CreateStaffLibraryDto) {
    return this.staffsLibraryService.create(createStaffLibraryDto);
  }

  @Get()
  findAll() {
    return this.staffsLibraryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffsLibraryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStaffLibraryDto: UpdateStaffLibraryDto,
  ) {
    return this.staffsLibraryService.update(+id, updateStaffLibraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffsLibraryService.remove(+id);
  }
}
