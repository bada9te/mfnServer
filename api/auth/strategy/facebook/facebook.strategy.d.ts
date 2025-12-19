import { Strategy, Profile } from "passport-facebook";
import { ConfigService } from "@nestjs/config";
import { JwtAuthService } from "../jwt/jwt.service";
import { Request } from "express";
import { UsersService } from "src/entities/users/users.service";
declare const FacebookOauthStrategy_base: new (...args: any[]) => Strategy;
export declare class FacebookOauthStrategy extends FacebookOauthStrategy_base {
    private configService;
    private jwtAuthService;
    private usersService;
    constructor(configService: ConfigService, jwtAuthService: JwtAuthService, usersService: UsersService);
    validate(_req: Request, accessToken: string, refreshToken: string, profile: Profile): Promise<import("mongoose").Document<unknown, {}, import("src/entities/users/users.schema").User> & import("src/entities/users/users.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
export {};
