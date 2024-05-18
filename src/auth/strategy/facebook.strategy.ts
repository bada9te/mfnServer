import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-facebook";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(private configService: ConfigService) {
        super({
            clientID     : configService.get('PASSPORT_FACEBOOK_ID'),
            clientSecret : configService.get('PASSPORT_FACEBOOK_SECRET'),
            callbackURL  : configService.get('PASSPORT_FACEBOOK_CALLBACK'),
            passReqToCallback : true
        });
    }

    async verify(
        accessToken: string, 
        refreshToken: string, 
        profile: Profile, 
    ) {
        
    }
}