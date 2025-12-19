import { Request, Response } from "express";
import { UsersService } from "src/entities/users/users.service";
import { JwtAuthService } from "./strategy/jwt/jwt.service";
import { NotificationsService } from "src/entities/notifications/notifications.service";
import { ConfigService } from "@nestjs/config";
export declare class AuthController {
    private usersService;
    private jwtService;
    private notificationsService;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtAuthService, notificationsService: NotificationsService, configService: ConfigService);
    getProfile(req: Request): Promise<{
        user: import("mongoose").Document<unknown, {}, import("../entities/users/users.schema").User> & import("../entities/users/users.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        };
        unreadNotifications: number;
    }>;
    logoutCurrentUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
