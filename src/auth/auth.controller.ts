import { Controller, Get, Res, UseGuards, Req, UnauthorizedException, Post } from "@nestjs/common";
import { Request, Response } from "express";
import { JwtAuthGuard } from "./strategy/jwt/jwt.guard";
import { UsersService } from "../entities/users/users.service";
import { JwtPayload } from "./strategy/jwt/jwt.strategy";
import { GoogleOauthGuard } from "./strategy/google/google.guard";
import { JwtAuthService } from "./strategy/jwt/jwt.service";
import { NotificationsService } from "../entities/notifications/notifications.service";
import { ConfigService } from "@nestjs/config";


@Controller('auth')
export class AuthController {
    constructor (
        private usersService: UsersService, 
        private jwtService: JwtAuthService,
        private notificationsService: NotificationsService,
        private configService: ConfigService
    ) {}


    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Req() req: Request) {
        const user = await this.usersService.getUserById((req.user as JwtPayload)._id);
        const unreadNotifications = await this.notificationsService.getDocsCount({receiver: user?._id, checked: false});

        //console.log({ reqUser: req.user, user, unreadNotifications })
        if (!user) {
            throw new UnauthorizedException("Unauthorized");
        }
        return { user, unreadNotifications };
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logoutCurrentUser(@Req() req: Request, @Res() res: Response) {
        const user = await this.usersService.getUserById((req.user as JwtPayload)._id);
        if (!user) {
            throw new UnauthorizedException("Unauthorized");
        }

        res.clearCookie(this.configService.get('SESSION_COOKIE_KEY') as string, { secure: true, sameSite: 'none' });

        res.clearCookie(this.configService.get('USER_ID_COOKIE_KEY') as string, { secure: true, sameSite: 'none' });

        return res.end();
    }
}