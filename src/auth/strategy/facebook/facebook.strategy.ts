import { Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-facebook";
import { ConfigService } from "@nestjs/config";
import { JwtAuthService } from "../jwt/jwt.service";
import { Request } from "express";
import { UserDocument } from "src/entities/users/users.schema";
import { UsersService } from "src/entities/users/users.service";


@Injectable()
export class FacebookOauthStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(private configService: ConfigService, private jwtAuthService: JwtAuthService, private usersService: UsersService) {
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

        let user: UserDocument | null = await this.usersService.getUserById(currentUserId);
        let processedUser: UserDocument | null;
        if (currentUserId && currentUserJwt) {
            //console.log({currentUserJwt, currentUserId});
            processedUser = await this.jwtAuthService.processFacebook(profile, accessToken, currentUserId);
        } else {
            processedUser = await this.jwtAuthService.processFacebook(profile, accessToken);
        }

        if (processedUser) {
            user = processedUser;
        }

        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}