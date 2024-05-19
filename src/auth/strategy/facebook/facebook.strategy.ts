import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-facebook";
import { ConfigService } from "@nestjs/config";
import { JwtAuthService } from "../jwt/jwt.service";


@Injectable()
export class FacebookOauthStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(private configService: ConfigService, private jwtAuthService: JwtAuthService) {
        super({
            clientID     : configService.get('PASSPORT_FACEBOOK_ID'),
            clientSecret : configService.get('PASSPORT_FACEBOOK_SECRET'),
            callbackURL  : configService.get('PASSPORT_FACEBOOK_CALLBACK'),
            passReqToCallback : true
        });
    }

    async verify(accessToken: string, refreshToken: string, profile: Profile) {
        const user = await this.jwtAuthService.processFacebook(profile, accessToken);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}