import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MulterModule } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // เปิดใช้งาน CORS

  await app.listen(3000);
}
bootstrap();
