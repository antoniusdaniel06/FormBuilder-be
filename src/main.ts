import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

// ✅ Swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS
  app.enableCors({
    origin: '*',
  });

  
  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove property yang tidak ada di DTO
      forbidNonWhitelisted: true, // error kalau ada property asing
      transform: true, 
    }),
  );

  // Static Folder (Uploads)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Form Builder API')
    .setDescription('API Documentation for Form Builder Project')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token', // name reference
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 
  
  // Dynamic Port

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📘 Swagger running on http://localhost:${PORT}/api`);
}

bootstrap();