import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = app.get<ConfigService>(ConfigService).get('port');
  const prismaService = app.get(PrismaService);

  await prismaService.enableShutdownHooks(app);

  Logger.log(`Start Application on PORT: ${port}`, 'Main');
  await app.listen(port);
}
bootstrap();
