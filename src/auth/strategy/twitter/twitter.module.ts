import { Module } from '@nestjs/common';
import { UsersModule } from 'src/entities/users/users.module';
import { JwtAuthModule } from '../jwt/jwt.module';
import { TwitterOauthController } from './twitter.controller';
import { TwitterOauthStrategy } from './twitter.strategy';


@Module({
    imports: [UsersModule, JwtAuthModule],
    controllers: [TwitterOauthController],
    providers: [TwitterOauthStrategy],
})
export class TwitterOauthModule {}