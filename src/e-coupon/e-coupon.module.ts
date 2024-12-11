import { Module } from '@nestjs/common';
import { ECouponService } from './e-coupon.service';
import { ECouponController } from './e-coupon.controller';

@Module({
  controllers: [ECouponController],
  providers: [ECouponService],
})
export class ECouponModule {}
