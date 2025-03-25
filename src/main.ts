import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe()); // Enables DTO validation globally
  app.enableCors(); // Enable CORS for frontend integration

  const PORT = process.env.PORT || 4000;
  await app.listen(PORT);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}

bootstrap();
