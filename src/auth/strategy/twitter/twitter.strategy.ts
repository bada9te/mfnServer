import { Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-twitter";
import { JwtAuthService } from "../jwt/jwt.service";
import { Request } from "express";

@Injectable()
export class TwitterOauthStrategy extends PassportStrategy(Strategy, 'twitter') {
    constructor(private configService: ConfigService, private jwtAuthService: JwtAuthService) {
        super({
            consumerKey      : configService.get('PASSPORT_TWITTER_KEY'),
            consumerSecret   : configService.get('PASSPORT_TWITTER_SECRET'),
            callbackURL      : configService.get('PASSPORT_TWITTER_CALLBACK'),
            includeEmail     : true,
            passReqToCallback: true
        });
    }

    async validate(@Req() _req: Request, token: string, tokenSecret: string, profile: any) {
        console.log("REQUEST USER", _req.user);
        const user = await this.jwtAuthService.processTwitter(profile, token);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}