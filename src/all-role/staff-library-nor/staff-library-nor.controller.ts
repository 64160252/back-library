import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaffLibraryNorService } from './staff-library-nor.service';
import { CreateStaffLibraryNorDto } from './dto/create-staff-library-nor.dto';
import { UpdateStaffLibraryNorDto } from './dto/update-staff-library-nor.dto';

@Controller('staff-library-nor')
export class StaffLibraryNorController {
  constructor(
    private readonly staffLibraryNorService: StaffLibraryNorService,
  ) {}

  // @Post()
  // create(@Body() createStaffLibraryNorDto: CreateStaffLibraryNorDto) {
  //   return this.staffLibraryNorService.create(createStaffLibraryNorDto);
  // }

  @Get()
  findAll() {
    return this.staffLibraryNorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffLibraryNorService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStaffLibraryNorDto: UpdateStaffLibraryNorDto,
  ) {
    return this.staffLibraryNorService.update(+id, updateStaffLibraryNorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffLibraryNorService.remove(+id);
  }
}
