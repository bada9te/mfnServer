import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthService } from '../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { TwitterOauthGuard } from './twitter.guard';
import { UserDocument } from 'src/entities/users/users.schema';


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

        const { accessToken, userId } = this.jwtAuthService.login(req.user);
            res.cookie(this.configService.get('SESSION_COOKIE_KEY'), accessToken, {
            httpOnly: true,
            sameSite: 'lax',
        });
        
        return res.redirect(`/profile/${userId}`);
    }
}