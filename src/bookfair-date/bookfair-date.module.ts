import { Module } from '@nestjs/common';
import { BookfairDateService } from './bookfair-date.service';
import { BookfairDateController } from './bookfair-date.controller';

@Module({
  controllers: [BookfairDateController],
  providers: [BookfairDateService],
})
export class BookfairDateModule {}
