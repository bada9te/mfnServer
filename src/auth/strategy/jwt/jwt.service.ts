import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/users/users.schema';
import { JwtPayload } from './jwt.strategy';
import * as argon from "argon2";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtAuthService {
    constructor(
        @InjectModel(User.name) private usersModel: Model<User>,
        private jwtService: JwtService
    ) {}

    login(user: any) {
        const payload: JwtPayload = { nickname: user.nick, _id: user._id.toString() };
        return {
            accessToken: this.jwtService.sign(payload),
            userId: payload._id,
        };
    }

    async validateLocal(email: string, password: string) {
        const user = await this.usersModel.findOne({ 'local.email': email });
        if (!user) {
            throw new ForbiddenException("Credentials incorrect");
        }

        const passwdMatches = argon.verify(user.local.password, password);
        if (!passwdMatches) {
            throw new ForbiddenException("Credentials incorrect");
        }
        
        if (!user.verified) {
            throw new ForbiddenException("Not verified");
        }
        
        return user;
    }

}