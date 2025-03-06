import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerCustomOptions } from 'node_modules/@nestjs/swagger/dist/interfaces/swagger-custom-options.interface.d';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  setupSwagger(app)
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.use('/upload', express.static(join(__dirname, '..', 'upload')));
  await app.listen(process.env.PORT ?? 3000);
}

function setupSwagger(app: INestApplication){
  const builder = new DocumentBuilder();
  const config = builder
    .setTitle('Chatty')
    .setDescription('API Doc')
    .setVersion('1.0')
    .build();

    const document = SwaggerModule.createDocument(app, config);
    const options: SwaggerCustomOptions={
      explorer:true
    }
    SwaggerModule.setup('api', app, document, options)
}
bootstrap();
