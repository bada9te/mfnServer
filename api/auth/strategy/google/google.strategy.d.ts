import { ConfigService } from "@nestjs/config";
import { OAuth2Strategy, Profile, VerifyFunction } from "passport-google-oauth";
import { JwtAuthService } from "../jwt/jwt.service";
import { Request } from "express";
import { UsersService } from "src/entities/users/users.service";
declare const GoogleOauthStrategy_base: new (...args: any[]) => OAuth2Strategy;
export declare class GoogleOauthStrategy extends GoogleOauthStrategy_base {
    private configService;
    private jwtAuthService;
    private usersService;
    constructor(configService: ConfigService, jwtAuthService: JwtAuthService, usersService: UsersService);
    validate(_req: Request, _accessToken: string, _refreshToken: string, profile: Profile, done: VerifyFunction): Promise<void>;
}
export {};
