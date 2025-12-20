import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express, { Request, Response } from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { MongoClient } from 'mongodb';
import path from 'path';
import 'dotenv/config';

const server = express();

async function bootstrap() {
  // Create NestJS app with Express adapter
  const app = await NestFactory.create(AppModule, server as any, { bufferLogs: true });

  // Middleware
  app.use(compression());
  app.use(cookieParser());

  // MongoDB client for session storage
  const mongoClient = new MongoClient(process.env.MONGO_URI!, { maxPoolSize: 5 });
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
        sameSite: 'lax', // 'none' if cross-domain
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    }),
  );

  // Enable CORS for your frontend
  app.enableCors({
    origin: process.env.CLIENT_BASE,
    credentials: true,
  });

  // Serve static files from /public
  app.use(express.static(path.join(__dirname, 'public')));

  // Default root endpoint for health check
  server.get('/', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'api' });
  });

  await app.init();
}

// Initialize the app
bootstrap();

// Export default server for Vercel
export default server;
