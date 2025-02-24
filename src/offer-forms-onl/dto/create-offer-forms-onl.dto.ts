import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsISBN,
  IsOptional,
} from 'class-validator';

export class CreateOfferFormsOnlDto {
  @IsNotEmpty()
  @IsISBN()
  ISBN: string;

  @IsNotEmpty()
  @IsString()
  book_title: string;

  @IsNotEmpty()
  @IsString()
  book_author: string;

  @IsOptional()
  @IsString()
  book_course: string;

  @IsOptional()
  @IsString()
  form_description: string;

  @IsNumber()
  @IsNotEmpty()
  user: number;
}
