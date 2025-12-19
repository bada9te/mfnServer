import { Request, Response } from "express";
import { JwtAuthService } from "../jwt/jwt.service";
import { ConfigService } from "@nestjs/config";
export declare class LocalOauthController {
    private jwtAuthService;
    private configService;
    constructor(jwtAuthService: JwtAuthService, configService: ConfigService);
    localAuth(req: Request, res: Response): Promise<void>;
}
