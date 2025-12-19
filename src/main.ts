import 'tsconfig-paths/register';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
// import * as session from 'express-session';
import * as express from 'express';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(compression());

  // app.use(
  //   session({
  //     secret: process.env.SESSION_SECRET,
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: { secure: false },
  //   }),
  // );

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CLIENT_BASE,
    credentials: true,
  });

  app.use(express.static(path.join(__dirname, 'public')));
  await app.listen(8000);
}
bootstrap();
