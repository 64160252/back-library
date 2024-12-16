import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaffLibraryAdmService } from './staff-library-adm.service';
import { CreateStaffLibraryAdmDto } from './dto/create-staff-library-adm.dto';
import { UpdateStaffLibraryAdmDto } from './dto/update-staff-library-adm.dto';

@Controller('staff-library-adm')
export class StaffLibraryAdmController {
  constructor(
    private readonly staffLibraryAdmService: StaffLibraryAdmService,
  ) {}

  // @Post()
  // create(@Body() createStaffLibraryAdmDto: CreateStaffLibraryAdmDto) {
  //   return this.staffLibraryAdmService.create(createStaffLibraryAdmDto);
  // }

  @Get()
  findAll() {
    return this.staffLibraryAdmService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffLibraryAdmService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStaffLibraryAdmDto: UpdateStaffLibraryAdmDto,
  ) {
    return this.staffLibraryAdmService.update(+id, updateStaffLibraryAdmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffLibraryAdmService.remove(+id);
  }
}
