import { Module } from '@nestjs/common';
import { OfferFormService } from './offer-form.service';
import { OfferFormController } from './offer-form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferForm } from './entities/offer-form.entity';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Store } from 'src/all-role/store/entities/store.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // โหลดค่าจาก .env
    TypeOrmModule.forFeature([OfferForm, User, Store]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ], // เชื่อมโยง Repository
  controllers: [OfferFormController],
  providers: [OfferFormService],
  exports: [OfferFormService],
})
export class OfferFormModule {}
