import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: false,
      exceptionFactory: (validationErrors: ValidationError[]) =>
        new BadRequestException({
          errors: validationErrors.map((error) => ({
            field: error.property,
            message: Object.values(error.constraints ?? {})[0],
          })),
        }),
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

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true,
  })

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
