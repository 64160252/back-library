import { PartialType } from '@nestjs/mapped-types';
import { CreateECouponDto } from './create-e-coupon.dto';

export class UpdateECouponDto extends PartialType(CreateECouponDto) {}
