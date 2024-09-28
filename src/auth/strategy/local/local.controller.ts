import { Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { LocalOauthGuard } from "./local.guard";
import { JwtAuthService } from "../jwt/jwt.service";
import { ConfigService } from "@nestjs/config";

@Controller('auth/local')
export class LocalOauthController {
    constructor(
        private jwtAuthService: JwtAuthService,
        private configService: ConfigService,
    ) {}
    
    
    @Post()
    @UseGuards(LocalOauthGuard)
    async localAuth(@Req() req: Request, @Res() res: Response) {
        const { userId, accessToken } = await this.jwtAuthService.login(req.user);

        res.cookie(this.configService.get('SESSION_COOKIE_KEY'), accessToken, {
            //httpOnly: true,
            sameSite: 'lax',
        });

        return res.redirect('me');
    }
}