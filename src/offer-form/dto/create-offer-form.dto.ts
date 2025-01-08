import {
  IsEmail,
  IsISBN,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateOfferFormDto {
  @IsOptional()
  @IsString()
  user_prefix: string;

  @IsString()
  @IsNotEmpty()
  user_fullname: string;

  @IsString()
  @IsNotEmpty()
  user_name: string;

  @IsNumber()
  @IsNotEmpty()
  role_id: number;

  @IsEmail()
  @IsNotEmpty()
  user_email: string;

  @IsString()
  @IsNotEmpty()
  user_tel: string;

  @IsNumber()
  @IsNotEmpty()
  faculty_id: number;

  @IsString()
  @IsNotEmpty()
  department_id: number;

  @IsNumber()
  @IsNotEmpty()
  store_id: number; // ชื่อร้านค้า

  @IsNotEmpty()
  @IsString()
  book_title: string; // ชื่อเรื่อง

  @IsNotEmpty()
  @IsString()
  book_author: string; // ชื่อผู้แต่ง

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  published_year: number; // ปีพิมพ์

  @IsNotEmpty()
  @IsISBN()
  ISBN: string; // ISBN

  @IsNotEmpty()
  @IsString()
  book_subject: string; // รายวิชา

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  book_price: number; // ราคาสุทธิ

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  book_quantity: number; // จำนวนเล่ม

  @IsNotEmpty()
  @IsString()
  coupon_used: string;

  @IsOptional()
  book_imgs: string[];

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
