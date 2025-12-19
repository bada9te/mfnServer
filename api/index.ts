import { Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';

let server: Handler;

async function bootstrapServer() {
  const expressApp = express();

  expressApp.use(cookieParser());

  const app = await NestFactory.create(AppModule, expressApp as any);
  app.enableCors({ origin: process.env.CLIENT_BASE, credentials: true });

  await app.init();

  return serverlessExpress({ app: expressApp });
}

export const handler = async (event, context) => {
  if (!server) {
    server = await bootstrapServer();
  }
  return server(event, context);
};
