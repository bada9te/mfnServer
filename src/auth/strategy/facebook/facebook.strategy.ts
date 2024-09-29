import { Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-facebook";
import { ConfigService } from "@nestjs/config";
import { JwtAuthService } from "../jwt/jwt.service";
import { Request } from "express";
import { UserDocument } from "src/entities/users/users.schema";


@Injectable()
export class FacebookOauthStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(private configService: ConfigService, private jwtAuthService: JwtAuthService) {
        super({
            clientID     : configService.get('PASSPORT_FACEBOOK_ID'),
            clientSecret : configService.get('PASSPORT_FACEBOOK_SECRET'),
            callbackURL  : configService.get('PASSPORT_FACEBOOK_CALLBACK'),
            passReqToCallback : true,
            scope: ['email']
        });
    }

    async validate(@Req() _req: Request, accessToken: string, refreshToken: string, profile: Profile) {
        const currentUserJwt = _req.cookies[this.configService.get('SESSION_COOKIE_KEY')];
        const currentUserId = _req.cookies[this.configService.get('USER_ID_COOKIE_KEY')];

        let user: UserDocument | null;
        if (currentUserId && currentUserJwt) {
            console.log({currentUserJwt, currentUserId});
            user = await this.jwtAuthService.processFacebook(profile, accessToken, currentUserId);
        } else {
            user = await this.jwtAuthService.processFacebook(profile, accessToken);
        }

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}