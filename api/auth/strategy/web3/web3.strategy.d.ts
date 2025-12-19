import { JwtAuthService } from "../jwt/jwt.service";
import { ConfigService } from "@nestjs/config";
declare const Web3OauthStrategy_base: new (...args: any[]) => any;
export declare class Web3OauthStrategy extends Web3OauthStrategy_base {
    private jwtAuthService;
    private configService;
    constructor(jwtAuthService: JwtAuthService, configService: ConfigService);
    validate(address: string, message: string, signed: string, done: any): Promise<void>;
}
export {};
