import { Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthService } from '../jwt/jwt.service';
import { GoogleOauthGuard } from './google.guard';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../jwt/jwt.guard';


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

        res.cookie(this.configService.get('SESSION_COOKIE_KEY') as string, accessToken, {
            //httpOnly: true,
            sameSite: 'none',
            secure: true,
        });

        res.cookie(this.configService.get('USER_ID_COOKIE_KEY') as string, userId, {
            sameSite: 'none',
            secure: true,
        });
        
        return res.redirect(this.configService.get('CLIENT_BASE') as string);
    }


}