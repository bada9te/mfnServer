import { Controller, Get, Res, UseGuards, Req, UnauthorizedException, Post } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "./strategy/jwt/jwt.guard";
import { UsersService } from "src/entities/users/users.service";
import { JwtPayload } from "./strategy/jwt/jwt.strategy";


@Controller('auth')
export class AuthController {
    constructor (private usersService: UsersService) {}


    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Req() req: Request) {
        const user = await this.usersService.getUserById((req.user as JwtPayload)._id);
        if (!user) {
            throw new UnauthorizedException("Unauthorized");
        }
        return user;
    }
}