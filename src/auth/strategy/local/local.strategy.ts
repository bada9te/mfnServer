import { Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { JwtAuthService } from "../jwt/jwt.service";
import { Request } from "express";


@Injectable()
export class LocalOauthStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(private jwtAuthService: JwtAuthService) {
        super({ 
            usernameField: 'email',
            passwordField : 'password',
            passReqToCallback : true,
        });
    }

    async validate(@Req() _req: Request, email: string, password: string) {
        const user = await this.jwtAuthService.processLocal(email, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}