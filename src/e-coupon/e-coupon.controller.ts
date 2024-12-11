import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ECouponService } from './e-coupon.service';
import { CreateECouponDto } from './dto/create-e-coupon.dto';
import { UpdateECouponDto } from './dto/update-e-coupon.dto';

@Controller('e-coupon')
export class ECouponController {
  constructor(private readonly eCouponService: ECouponService) {}

  @Post()
  create(@Body() createECouponDto: CreateECouponDto) {
    return this.eCouponService.create(createECouponDto);
  }

  @Get()
  findAll() {
    return this.eCouponService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eCouponService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateECouponDto: UpdateECouponDto) {
    return this.eCouponService.update(+id, updateECouponDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eCouponService.remove(+id);
  }
}
