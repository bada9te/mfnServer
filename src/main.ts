import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
// import * as compression from 'compression';
// import * as session from 'express-session';
import * as express from 'express';
import * as path from 'path';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@codegenie/serverless-express';
require("dotenv").config();


let server: Handler;


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(compression());

  // app.use(
  //   session({
  //     secret: process.env.SESSION_SECRET,
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: { secure: false },
  //   }),
  // );

  // @ts-ignore
  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CLIENT_BASE,
    credentials: true,
  });

  app.use(express.static(path.join(__dirname, 'public')));

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
