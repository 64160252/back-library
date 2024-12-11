import { Test, TestingModule } from '@nestjs/testing';
import { ECouponController } from './e-coupon.controller';
import { ECouponService } from './e-coupon.service';

describe('ECouponController', () => {
  let controller: ECouponController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ECouponController],
      providers: [ECouponService],
    }).compile();

    controller = module.get<ECouponController>(ECouponController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
