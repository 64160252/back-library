import { Module } from '@nestjs/common';
import { OfferFormsOflService } from './offer-forms-ofl.service';
import { OfferFormsOflController } from './offer-forms-ofl.controller';
import { Department } from 'src/departments/entities/department.entity';
import { Faculty } from 'src/faculties/entities/faculty.entity';
import { Library } from 'src/library/entities/library.entity';
import { User } from 'src/users/entities/user.entity';
import { OfferFormsOfl } from './entities/offer-forms-ofl.entity';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/Role-and-Duty/store/entities/store.entity';
import { Book } from 'src/books/entities/book.entity';

@Module({
  imports: [
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
      }),
      TypeOrmModule.forFeature([OfferFormsOfl, User, Library, Faculty, Department, Store, Book]),
    ],
  controllers: [OfferFormsOflController],
  providers: [OfferFormsOflService],
  exports: [OfferFormsOflService],
})
export class OfferFormsOflModule {}
