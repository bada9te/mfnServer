// api/index.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import serverlessExpress from '@vendia/serverless-express';
import { Handler } from 'aws-lambda';

let cachedServer: Handler;

async function bootstrapServer(): Promise<Handler> {
  const expressApp = express();
  expressApp.use(cookieParser());

  const app = await NestFactory.create(AppModule, expressApp as any);
  app.enableCors({ origin: process.env.CLIENT_BASE, credentials: true });
  await app.init();

  return serverlessExpress({ app: expressApp });
}

// Vercel expects a default export
export default async function handler(event, context) {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return cachedServer(event, context);
}
