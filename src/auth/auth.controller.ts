import { Controller, Get, Res, UseGuards, Req } from "@nestjs/common";
import { Response, Request } from "express";
import { JwtAuthGuard } from "./strategy/jwt/jwt.guard";


@Controller('auth')
export class AuthController {
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req: Request) {
        return req.user;
    }
}