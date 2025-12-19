import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/users/users.schema';
import { Model } from 'mongoose';
export declare class JwtAuthService {
    private usersModel;
    private jwtService;
    constructor(usersModel: Model<User>, jwtService: JwtService);
    login(user: any): Promise<{
        accessToken: string;
        userId: string;
    }>;
    processLocal(email: string, password: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    processWeb3(address: string, message: string, signed: string, currentUserId?: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    processTwitter(profile: any, token: string, currentUserId?: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    processGoogle(profile: any, token: string, currentUserId?: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    processFacebook(profile: any, token: string, currentUserId?: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
