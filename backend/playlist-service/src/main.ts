import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitando CORS
  app.enableCors();
  
  // Validação global de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('WatchPlay Playlist Service')
    .setDescription('API de gerenciamento de playlists do WatchPlay')
    .setVersion('1.0')
    .addTag('playlists')
    .addTag('videos')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Porta específica para o serviço de playlists
  await app.listen(3002);
  console.log(`Playlist service is running on: ${await app.getUrl()}`);
}
bootstrap();
