import { Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { JwtAuthService } from "../jwt/jwt.service";
import { Request } from "express";
import { Strategy } from "@superfaceai/passport-twitter-oauth2";
import { UserDocument } from "src/entities/users/users.schema";

@Injectable()
export class TwitterOauthStrategy extends PassportStrategy(Strategy, 'twitter') {
    constructor(private configService: ConfigService, private jwtAuthService: JwtAuthService) {
        super({
            clientType:   'confidential',
            clientID:     configService.get('PASSPORT_TWITTER_KEY'),
            clientSecret: configService.get('PASSPORT_TWITTER_SECRET'),
            callbackURL:  configService.get('PASSPORT_TWITTER_CALLBACK'),
            scope:        ['tweet.read', 'tweet.write', 'users.read'],
            passReqToCallback: true,
        });
    }

    async validate(@Req() _req: Request, token: string, tokenSecret: string, profile: any) {
        const currentUserJwt = _req.cookies[this.configService.get('SESSION_COOKIE_KEY')];
        const currentUserId = _req.cookies[this.configService.get('USER_ID_COOKIE_KEY')];
        
        let user: UserDocument | null;
        if (currentUserId && currentUserJwt) {
            console.log({currentUserJwt, currentUserId});
            user = await this.jwtAuthService.processTwitter(profile, token, currentUserId);
        } else {
            user = await this.jwtAuthService.processTwitter(profile, token);
        }
        
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}