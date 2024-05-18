import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { OAuth2Strategy, Profile } from "passport-google-oauth";


@Injectable()
export class GoogleStrategy extends PassportStrategy(OAuth2Strategy, 'google') {
    constructor(private configService: ConfigService) {
        super({
            clientID     : configService.get('PASSPORT_GOOGLE_ID'),
            clientSecret : configService.get('PASSPORT_GOOGLE_SECRET'),
            callbackURL  : configService.get('PASSPORT_GOOGLE_CALLBACK'),
            passReqToCallback : true
        });
    }

    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
    ) {
        
    }
}