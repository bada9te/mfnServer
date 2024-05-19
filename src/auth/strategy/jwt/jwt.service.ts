import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/entities/users/users.schema';
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

    async processLocal(email: string, password: string) {
        const user = await this.usersModel.findOne({ 'local.email': email });
        if (!user) {
            return null;
        }

        const passwdMatches = argon.verify(user.local.password, password);
        if (!passwdMatches) {
            return null;
        }
        
        if (!user.verified) {
            return null;
        }
        
        return user;
    }


    async processTwitter(profile: any, token: string) {
        const user = await this.usersModel.findOne({ 'twitter.id' : profile.id });
        try {
            if (user) {
                // if there is a user id already but no token (user was linked at one point and then removed)
                if (!user.twitter?.token) {
                    user.twitter.token = token;
                    user.twitter.username = profile.username;
                    user.twitter.displayName = profile.displayName;
                    user.twitter.email = profile.emails[0].value;

                    const updatedUser = await user.save();
                    return updatedUser;
                }

                return user; // user found, return that user
            } else {
                // if there is no user, create 
                const newUser = new this.usersModel({
                    nick: profile.displayName,
                    twitter: {
                        id: profile.id,
                        token: token,
                        username: profile.username,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                    },
                });
          
                const createdUser = await newUser.save();
                return createdUser;
            }
        } catch (error) {
            return null;
        }
    }

    async processGoogle(profile: any, token: string) {
        try {
            const user = await this.usersModel.findOne({ 'google.id' : profile.id });

            if (user) {
                // if there is a user id already but no token (user was linked at one point and then removed)
                if (!user.google?.token) {
                    user.google.token = token;
                    user.google.name  = profile.displayName;
                    user.google.email = profile.emails[0].value; // pull the first email

                    const createdUser = await user.save();
                    return createdUser;
                }

                return user;
            } else {
                var newUser = new this.usersModel({
                    nick: profile.displayName,
                    google: {
                        id: profile.id,
                        token: token,
                        name: profile.displayName,
                        email: profile.emails[0].value
                    }
                });

                const createdUser = await newUser.save();
                return createdUser;
            }
        } catch (error) {
            return null;
        }
    }

    async processFacebook(profile: any, token: string) {
        try {
            const user = await this.usersModel.findOne({ 'facebook.id' : profile.id });

            if (user) {
                // if there is a user id already but no token (user was linked at one point and then removed)
                if (!user.facebook?.token) {
                    user.facebook.token = token;
                    user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    user.facebook.email = profile.emails[0].value;

                    const updatedUser = await user.save();
                    return updatedUser;
                }

                return user; 
            } else {
                // if there is no user, create 
                var newUser = new this.usersModel({
                    nick: profile.name.givenName,
                    facebook: {
                        id: profile.id,
                        token: token,
                        name: profile.name.givenName + ' ' + profile.name.familyName,
                        email: profile.emails[0].value,
                    }
                });

                const createdUser = await newUser.save();
                return createdUser;
            }
        } catch (error) {
            return null;
        }
    }
}