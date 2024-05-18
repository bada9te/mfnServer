import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-twitter";

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy, 'twitter') {
    constructor(private configService: ConfigService) {
        super({
            consumerKey      : configService.get('PASSPORT_TWITTER_KEY'),
            consumerSecret   : configService.get('PASSPORT_TWITTER_SECRET'),
            callbackURL      : configService.get('PASSPORT_TWITTER_CALLBACK'),
            includeEmail     : true,
            passReqToCallback: true
        });
    }

    async verify(
        token: string, 
        tokenSecret: string, 
        profile: any
    ) {
        
    }
}