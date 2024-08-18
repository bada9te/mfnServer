import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as session from 'express-session';
require("dotenv").config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(compression());

  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CLIENT_BASE,
    credentials: true, // Allow credentials
  });
  
  await app.listen(8000);
}
bootstrap();
