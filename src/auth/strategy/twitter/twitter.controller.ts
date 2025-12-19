import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthService } from '../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { TwitterOauthGuard } from './twitter.guard';


@Controller('auth/twitter')
export class TwitterOauthController {
    constructor(
        private jwtAuthService: JwtAuthService,
        private configService: ConfigService
    ) {}

    @Get()
    @UseGuards(TwitterOauthGuard)
    async twitterAuth(@Req() _req: Request) {
        // Guard redirects
    }

    @Get('callback')
    @UseGuards(TwitterOauthGuard)
    async twitterAuthRedirect(@Req() req: Request, @Res() res: Response) {
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