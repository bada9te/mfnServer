import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as session from 'express-session';
import * as express from 'express';
import * as path from 'path';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@codegenie/serverless-express';
import MongoStore from 'connect-mongo';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

let server: Handler;
let mongoClient: MongoClient;

/**
 * Reuse MongoDB connection across Lambda invocations
 */
async function getMongoClient() {
  if (!mongoClient) {
    mongoClient = new MongoClient(process.env.MONGO_URI!, {
      maxPoolSize: 5,
    });
    await mongoClient.connect();
  }
  return mongoClient;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(compression());
  app.use(cookieParser());

  const client = await getMongoClient();

  app.use(
    session({
      name: 'sid',
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        client,
        dbName: 'sessions',
        collectionName: 'sessions',
        ttl: 60 * 60 * 24, // 1 day
      }),
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none', // REQUIRED for cross-domain cookies
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );

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
  context.callbackWaitsForEmptyEventLoop = false;
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
