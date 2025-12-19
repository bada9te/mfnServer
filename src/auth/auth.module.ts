import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UsersModule } from '../entities/users/users.module';
import { GoogleOauthModule } from './strategy/google/google.module';
import { JwtAuthModule } from './strategy/jwt/jwt.module';
import { FacebookOauthModule } from './strategy/facebook/facebook.module';
import { TwitterOauthModule } from './strategy/twitter/twitter.module';
import { LocalOauthModule } from './strategy/local/local.module';
import { NotificationsModule } from '../entities/notifications/notifications.module';
import { Web3OauthModule } from './strategy/web3/web3.module';


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
    Web3OauthModule,
  ],
})
export class AuthModule {}