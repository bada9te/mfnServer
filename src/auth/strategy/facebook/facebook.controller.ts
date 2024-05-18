import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthService } from '../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { FacebookOauthGuard } from './facebook.guard';


@Controller('auth/facebook')
export class FacebookOauthController {
    constructor(
        private jwtAuthService: JwtAuthService,
        private configService: ConfigService
    ) {}

    @Get()
    @UseGuards(FacebookOauthGuard)
    async facebookAuth(@Req() _req: Request) {
        // Guard redirects
    }

    @Get('callback')
    @UseGuards(FacebookOauthGuard)
    async facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const { accessToken, userId } = this.jwtAuthService.login(req.user);

            res.cookie(this.configService.get('SESSION_COOKIE_KEY'), accessToken, {
            httpOnly: true,
            sameSite: 'lax',
        });
        
        return res.redirect(`/profile/${userId}`);
    }
}