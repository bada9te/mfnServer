import { Strategy } from "passport-local";
import { JwtAuthService } from "../jwt/jwt.service";
import { Request } from "express";
declare const LocalOauthStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalOauthStrategy extends LocalOauthStrategy_base {
    private jwtAuthService;
    constructor(jwtAuthService: JwtAuthService);
    validate(_req: Request, email: string, password: string): Promise<import("mongoose").Document<unknown, {}, import("../../../entities/users/users.schema").User> & import("../../../entities/users/users.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
export {};
