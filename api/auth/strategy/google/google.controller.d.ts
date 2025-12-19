import { Request, Response } from 'express';
import { JwtAuthService } from '../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
export declare class GoogleOauthController {
    private jwtAuthService;
    private configService;
    constructor(jwtAuthService: JwtAuthService, configService: ConfigService);
    googleAuth(_req: Request): Promise<void>;
    googleAuthRedirect(req: Request, res: Response): Promise<void>;
}
