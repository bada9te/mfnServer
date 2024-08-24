import { Controller, Get, Res, UseGuards, Req, UnauthorizedException, Post } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "./strategy/jwt/jwt.guard";
import { UsersService } from "src/entities/users/users.service";
import { JwtPayload } from "./strategy/jwt/jwt.strategy";
import { GoogleOauthGuard } from "./strategy/google/google.guard";
import { JwtAuthService } from "./strategy/jwt/jwt.service";
import { NotificationsService } from "src/entities/notifications/notifications.service";


@Controller('auth')
export class AuthController {
    constructor (
        private usersService: UsersService, 
        private jwtService: JwtAuthService,
        private notificationsService: NotificationsService,
    ) {}


    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Req() req: Request) {
        const user = await this.usersService.getUserById((req.user as JwtPayload)._id);
        const unreadNotifications = await this.notificationsService.getDocsCount({receiver: user._id, checked: false});
        if (!user) {
            throw new UnauthorizedException("Unauthorized");
        }
        return { user, unreadNotifications };
    }
}