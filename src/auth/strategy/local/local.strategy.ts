import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { JwtAuthService } from "../jwt/jwt.service";


@Injectable()
export class LocalOauthStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private jwtAuthService: JwtAuthService) {
        super({ 
            usernameField: 'email',
            passwordField : 'password',
            passReqToCallback : true,
        });
    }

    async validate(email: string, password: string) {
        const user = await this.jwtAuthService.processLocal(email, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}