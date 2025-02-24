import { IsNotEmpty, IsString, IsNumber, IsISBN } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsISBN()
  ISBN: string;

  @IsNotEmpty()
  @IsString()
  book_title: string;

  @IsNotEmpty()
  @IsString()
  book_author: string;

  @IsNotEmpty()
  @IsNumber()
  book_price: number;

  @IsNotEmpty()
  @IsString()
  book_category: string;

  @IsNotEmpty()
  @IsString()
  book_published: string;

  @IsNumber()
  @IsNotEmpty()
  store: number; 
}
