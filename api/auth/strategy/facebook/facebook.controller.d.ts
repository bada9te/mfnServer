import { Request, Response } from 'express';
import { JwtAuthService } from '../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
export declare class FacebookOauthController {
    private jwtAuthService;
    private configService;
    constructor(jwtAuthService: JwtAuthService, configService: ConfigService);
    facebookAuth(_req: Request): Promise<void>;
    facebookAuthRedirect(req: Request, res: Response): Promise<void>;
}
