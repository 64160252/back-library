import { Test, TestingModule } from '@nestjs/testing';
import { ECouponService } from './e-coupon.service';

describe('ECouponService', () => {
  let service: ECouponService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ECouponService],
    }).compile();

    service = module.get<ECouponService>(ECouponService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
