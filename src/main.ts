import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS (lebih aman kalau spesifik)
  app.enableCors({
  origin: '*',
});

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Static folder (uploads)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Port dynamic (PENTING untuk production)
  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);
  console.log(`🚀 Server running on port ${PORT}`);
}
bootstrap();