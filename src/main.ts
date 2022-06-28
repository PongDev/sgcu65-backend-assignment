import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const port = config.get<number>('port');
  const prismaService = app.get(PrismaService);

  await prismaService.enableShutdownHooks(app);

  if (config.get<boolean>('swagger.enable')) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Task Manager System')
      .setDescription(
        'This Project is a part of ISD SGCU 65 Recuitment Assignment',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup(
      config.get<string>('swagger.prefix'),
      app,
      swaggerDocument,
    );
  }

  Logger.log(`Start Application on PORT: ${port}`, 'Main');
  await app.listen(port);
}
bootstrap();
