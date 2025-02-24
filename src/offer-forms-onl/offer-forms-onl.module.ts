import { Module } from '@nestjs/common';
import { OfferFormsOnlService } from './offer-forms-onl.service';
import { OfferFormsOnlController } from './offer-forms-onl.controller';
import { OfferFormsOnl } from './entities/offer-forms-onl.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([OfferFormsOnl, User]),
  ],
  controllers: [OfferFormsOnlController],
  providers: [OfferFormsOnlService],
  exports: [OfferFormsOnlService],
})
export class OfferFormsOnlModule {}
