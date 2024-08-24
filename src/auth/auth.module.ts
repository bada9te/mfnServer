import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/entities/users/users.module';
import { GoogleOauthModule } from './strategy/google/google.module';
import { JwtAuthModule } from './strategy/jwt/jwt.module';
import { FacebookOauthModule } from './strategy/facebook/facebook.module';
import { TwitterOauthModule } from './strategy/twitter/twitter.module';
import { LocalOauthModule } from './strategy/local/local.module';
import { NotificationsModule } from 'src/entities/notifications/notifications.module';


@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    JwtAuthModule,
    LocalOauthModule,
    GoogleOauthModule,
    FacebookOauthModule,
    TwitterOauthModule,
    NotificationsModule,
  ],
})
export class AuthModule {}