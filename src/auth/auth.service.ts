import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/entities/users/users.schema';
import * as argon from "argon2";

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private usersModel: Model<User>) {}


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


    async processGoogle(req: Express.Request) {
        if (!req.user) {
            // if user NOT logged in
        } else {
            // if user logged in
        }
    }

    async processFacebook(req: Express.Request) {
        if (!req.user) {
            // if user NOT logged in
        } else {
            // if user logged in
        }
    }

    async processTwitter(req: Express.Request) {
        if (!req.user) {
            // if user NOT logged in
        } else {
            // if user logged in
        }
    }
}
