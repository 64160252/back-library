import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // เปิดใช้งาน CORS
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // ตัด property ที่ไม่ได้ระบุใน DTO
  //     forbidNonWhitelisted: true, // ป้องกัน property ที่ไม่ได้ระบุ
  //     transform: true, // แปลงค่าตามชนิดข้อมูลใน DTO
  //   }),
  // );

  await app.listen(3000);
}
bootstrap();
