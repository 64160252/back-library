import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsISBN,
  IsOptional,
} from 'class-validator';

export class CreateOfferFormsOflDto {
  @IsNotEmpty()
  @IsString()
  book_title: string;

  @IsNotEmpty()
  @IsString()
  book_author: string;

  @IsNotEmpty()
  @IsNumber()
  published_year: number;

  @IsNotEmpty()
  @IsISBN()
  ISBN: string;

  @IsNotEmpty()
  @IsString()
  book_subject: string;

  @IsNotEmpty()
  @IsNumber()
  book_price: number;

  @IsNotEmpty()
  @IsNumber()
  book_quantity: number;

  @IsOptional()
  @IsString()
  book_category: string;

  @IsNumber()
  @IsNotEmpty()
  store: number;

  @IsNumber()
  @IsNotEmpty()
  user: number;
}
