import { IsISBN, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateOfferFormDto {
  @IsNotEmpty()
  @IsString()
  market_name: string; // ชื่อร้านค้า

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
  book_file: any; // ไฟล์ (อัปโหลดรูปภาพ)

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
