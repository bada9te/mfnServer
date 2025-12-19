import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
export type JwtPayload = {
    _id: string;
    nickname: string;
};
declare const JwtAuthStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtAuthStrategy extends JwtAuthStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): Promise<JwtPayload>;
}
export {};
