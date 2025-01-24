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
  @IsString()
  @IsOptional()
  user_fullname: string;

  @IsString()
  @IsOptional()
  user_name: string;

  @IsNumber()
  @IsOptional()
  role_id: number;

  @IsEmail()
  @IsOptional()
  user_email: string;

  @IsString()
  @IsOptional()
  user_tel: string;

  @IsNumber()
  @IsOptional()
  faculty_id: number;

  @IsString()
  @IsOptional()
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

  @IsOptional()
  @IsString()
  coupon_used: string;

  @IsOptional()
  book_imgs: string[];

  @IsOptional()
  @IsString()
  duplicate_check: string;

  @IsOptional()
  @IsString()
  form_status: string;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
