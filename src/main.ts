import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-excpetion_filter';
import * as cookieParser from 'cookie-parser';
import { TokenExceptionFilter } from './middleware/excpetion.handler';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.useStaticAssets(join('public'));
  app.setBaseViewsDir(join('views'));
  app.setViewEngine('ejs');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  app.useGlobalFilters(new TokenExceptionFilter());
  // const options = new DocumentBuilder().addBearerAuth();
  const config = new DocumentBuilder()
    .setTitle('Mattress online shop')
    .setDescription('Shop where you can buy any mattress that you want')
    .setVersion('1.0')
    .addTag('mattresses')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);
  let port = configService.get('PORT');
  if (port == undefined) {
    port = 3000;
  }
  await app.listen(port);
}
bootstrap();
