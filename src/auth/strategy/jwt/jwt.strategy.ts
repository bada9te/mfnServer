import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";

export type JwtPayload = { _id: string; nickname: string };

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private configService: ConfigService) {
        const extractJwtFromCookie = (req) => {
            let token = null;
            if (req && req.cookies) {
                token = req.cookies[configService.get("SESSION_COOKIE_KEY")];
            }
            return token;
        };

        super({
            jwtFromRequest: extractJwtFromCookie,
            secretOrKey: configService.get("JWT_SECRET"),
            ignoreExpiration: false,
        });
    }

    async validate(payload: JwtPayload) {
        return payload;
    }
}