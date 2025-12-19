import { Module } from '@nestjs/common';
import { UsersModule } from '../../../entities/users/users.module';
import { JwtAuthModule } from '../jwt/jwt.module';
import { FacebookOauthStrategy } from './facebook.strategy';
import { FacebookOauthController } from './facebook.controller';


@Module({
    imports: [UsersModule, JwtAuthModule],
    controllers: [FacebookOauthController],
    providers: [FacebookOauthStrategy],
})
export class FacebookOauthModule {}