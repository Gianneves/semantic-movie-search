import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: false
    })
  );

  if (configService.get('NODE_ENV') !== 'production') {
    const documentBuilderConfig = new DocumentBuilder()
      .setTitle('SemanticMovieSearch')
      .setDescription('A semantic movie search using rag')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, documentBuilderConfig);
    SwaggerModule.setup('api-doc', app, document);
  }

  app.setGlobalPrefix('api/v1');

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
