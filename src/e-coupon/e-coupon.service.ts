import { Injectable } from '@nestjs/common';
import { CreateECouponDto } from './dto/create-e-coupon.dto';
import { UpdateECouponDto } from './dto/update-e-coupon.dto';

@Injectable()
export class ECouponService {
  create(createECouponDto: CreateECouponDto) {
    return 'This action adds a new eCoupon';
  }

  findAll() {
    return `This action returns all eCoupon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eCoupon`;
  }

  update(id: number, updateECouponDto: UpdateECouponDto) {
    return `This action updates a #${id} eCoupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} eCoupon`;
  }
}
