import { ConfigService } from "@nestjs/config";
import { JwtAuthService } from "../jwt/jwt.service";
import { Request } from "express";
import { Strategy } from "@superfaceai/passport-twitter-oauth2";
import { UsersService } from "src/entities/users/users.service";
declare const TwitterOauthStrategy_base: new (...args: any[]) => Strategy;
export declare class TwitterOauthStrategy extends TwitterOauthStrategy_base {
    private configService;
    private jwtAuthService;
    private usersService;
    constructor(configService: ConfigService, jwtAuthService: JwtAuthService, usersService: UsersService);
    validate(_req: Request, token: string, tokenSecret: string, profile: any): Promise<import("mongoose").Document<unknown, {}, import("src/entities/users/users.schema").User> & import("src/entities/users/users.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
export {};
