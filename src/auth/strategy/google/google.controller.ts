import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthService } from '../jwt/jwt.service';
import { GoogleOauthGuard } from './google.guard';
import { ConfigService } from '@nestjs/config';


@Controller('auth/google')
export class GoogleOauthController {
    constructor(
        private jwtAuthService: JwtAuthService,
        private configService: ConfigService,
    ) {}

    @Get()
    @UseGuards(GoogleOauthGuard)
    async googleAuth(@Req() _req: Request) {
        // Guard redirects
    }

    @Get('callback')
    @UseGuards(GoogleOauthGuard)
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        const { accessToken, userId } = await this.jwtAuthService.login(req.user);

        res.cookie(this.configService.get('SESSION_COOKIE_KEY'), accessToken, {
            httpOnly: true,
            sameSite: 'lax',
        });
        
        return res.redirect('me');
    }
}