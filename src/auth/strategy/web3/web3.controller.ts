import { Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthService } from "../jwt/jwt.service";
import { Web3OauthGuard } from "./web3.guard";
import { ConfigService } from "@nestjs/config";

@Controller('auth/web3')
export class Web3OauthController {
    constructor(
        private jwtAuthService: JwtAuthService,
        private configService: ConfigService,
    ) {}

    @Post()
    @UseGuards(Web3OauthGuard)
    async web3Auth(@Req() req: Request, @Res() res: Response) {
        const { userId, accessToken } = await this.jwtAuthService.login(req.user);

        res.cookie(this.configService.get('SESSION_COOKIE_KEY'), accessToken, {
            sameSite: 'none',
            secure: true,
        });

        res.cookie(this.configService.get('USER_ID_COOKIE_KEY'), userId, {
            sameSite: 'none',
            secure: true,
        });

        return res.redirect('me');
    }
}