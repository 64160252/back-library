import * as express from 'express'; // เพิ่ม import express
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // เสิร์ฟโฟลเดอร์ images
  app.use('/images', express.static(path.join(__dirname, '..', 'images')));
  app.enableCors(); // เปิดใช้งาน CORS

  await app.listen(3000);
}
bootstrap();
