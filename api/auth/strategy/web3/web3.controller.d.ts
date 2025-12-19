import { Request, Response } from "express";
import { JwtAuthService } from "../jwt/jwt.service";
import { ConfigService } from "@nestjs/config";
export declare class Web3OauthController {
    private jwtAuthService;
    private configService;
    constructor(jwtAuthService: JwtAuthService, configService: ConfigService);
    web3Auth(req: Request, res: Response): Promise<void>;
}
