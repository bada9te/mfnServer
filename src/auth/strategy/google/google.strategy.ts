import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { OAuth2Strategy, Profile } from "passport-google-oauth";
import { JwtAuthService } from "../jwt/jwt.service";


@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(OAuth2Strategy, 'google') {
    constructor(private configService: ConfigService, private jwtAuthService: JwtAuthService) {
        super({
            clientID     : configService.get('PASSPORT_GOOGLE_ID'),
            clientSecret : configService.get('PASSPORT_GOOGLE_SECRET'),
            callbackURL  : configService.get('PASSPORT_GOOGLE_CALLBACK'),
            passReqToCallback : true
        });
    }

    async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
        const user = await this.jwtAuthService.processGoogle(profile, _accessToken);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}