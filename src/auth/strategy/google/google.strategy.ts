import { Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { OAuth2Strategy, Profile, VerifyFunction } from "passport-google-oauth";
import { JwtAuthService } from "../jwt/jwt.service";
import { Request } from "express";
import { UserDocument } from "src/entities/users/users.schema";


@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(OAuth2Strategy, 'google') {
    constructor(private configService: ConfigService, private jwtAuthService: JwtAuthService) {
        super({
            clientID     : configService.get('PASSPORT_GOOGLE_ID'),
            clientSecret : configService.get('PASSPORT_GOOGLE_SECRET'),
            callbackURL  : configService.get('PASSPORT_GOOGLE_CALLBACK'),
            passReqToCallback : true,
            scope: ['profile', 'email']
        });
    }

    async validate(@Req() _req: Request, _accessToken: string, _refreshToken: string, profile: Profile, done: VerifyFunction) {
        const currentUserJwt = _req.cookies[this.configService.get('SESSION_COOKIE_KEY')];
        const currentUserId = _req.cookies[this.configService.get('USER_ID_COOKIE_KEY')];

        let user: UserDocument | null;
        if (currentUserId && currentUserJwt) {
            console.log({currentUserJwt, currentUserId});
            user = await this.jwtAuthService.processGoogle(profile, _accessToken, currentUserId);
        } else {
            user = await this.jwtAuthService.processGoogle(profile, _accessToken);
        }

        if (!user) {
            throw new UnauthorizedException();
        }
        done(null, user);
    }
}