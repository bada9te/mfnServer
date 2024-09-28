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
        
        res.cookie(this.configService.get('SESSION_COOKIE_KEY'), accessToken, {
            //httpOnly: true,
            sameSite: 'none',
            secure: true,
            domain: this.configService.get('CLIENT_DOMAIN')
        });
        
        return res.redirect(`me`);
    }
}