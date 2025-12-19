import { Request, Response } from 'express';
import { JwtAuthService } from '../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
export declare class TwitterOauthController {
    private jwtAuthService;
    private configService;
    constructor(jwtAuthService: JwtAuthService, configService: ConfigService);
    twitterAuth(_req: Request): Promise<void>;
    twitterAuthRedirect(req: Request, res: Response): Promise<void>;
}
