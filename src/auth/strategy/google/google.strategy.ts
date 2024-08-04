import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { OAuth2Strategy, Profile, VerifyFunction } from "passport-google-oauth";
import { JwtAuthService } from "../jwt/jwt.service";


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

    async validate(req: any, _accessToken: string, _refreshToken: string, profile: Profile, done: VerifyFunction) {
        const user = await this.jwtAuthService.processGoogle(profile, _accessToken);
        if (!user) {
            throw new UnauthorizedException();
        }

        done(null, user);
    }
}