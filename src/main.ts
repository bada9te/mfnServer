import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(compression());

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true, // Allow credentials
  });
  
  await app.listen(8000);
}
bootstrap();
