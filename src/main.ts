import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  app.enableCors();
  app.use('/uploads', express.static('uploads')); // Serve uploaded files statically

  await app.listen(3000);
}
bootstrap();
