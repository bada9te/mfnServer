import { Module } from '@nestjs/common';
import { UsersModule } from 'src/entities/users/users.module';
import { JwtAuthModule } from '../jwt/jwt.module';
import { GoogleOauthController } from './google.controller';
import { GoogleOauthStrategy } from './google.strategy';


@Module({
    imports: [UsersModule, JwtAuthModule],
    controllers: [GoogleOauthController],
    providers: [GoogleOauthStrategy],
})
export class GoogleOauthModule {}