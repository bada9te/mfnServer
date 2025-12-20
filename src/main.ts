import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import * as express from 'express';
import * as path from 'path';
import MongoStore from 'connect-mongo';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(compression());
  app.use(cookieParser());

  // MongoDB client for session storage
  const mongoClient = new MongoClient(process.env.MONGO_URI!, {
    maxPoolSize: 5,
  });
  await mongoClient.connect();

  app.use(
    session({
      name: 'sid',
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        client: mongoClient,
        dbName: 'sessions',
        collectionName: 'sessions',
        ttl: 60 * 60 * 24, // 1 day
      }),
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // 'none' if cross-domain, 'lax' if same-site
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );

  app.enableCors({
    origin: process.env.CLIENT_BASE,
    credentials: true,
  });

  // Serve static files from "public"
  app.use(express.static(path.join(__dirname, 'public')));

  // Start the NestJS app normally
  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();
