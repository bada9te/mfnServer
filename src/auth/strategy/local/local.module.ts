import { Module } from '@nestjs/common';
import { UsersModule } from '../../../entities/users/users.module';
import { JwtAuthModule } from '../jwt/jwt.module';
import { LocalOauthController } from './local.controller';
import { LocalOauthStrategy } from './local.strategy';


@Module({
    imports: [UsersModule, JwtAuthModule],
    controllers: [LocalOauthController],
    providers: [LocalOauthStrategy],
})
export class LocalOauthModule {}
