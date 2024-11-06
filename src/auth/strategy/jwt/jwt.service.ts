import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/users/users.schema';
import { JwtPayload } from './jwt.strategy';
import * as bcrypt from "bcrypt";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtAuthService {
    constructor(
        @InjectModel(User.name) private usersModel: Model<User>,
        private jwtService: JwtService
    ) {}

    async login(user: any) {
        const payload: JwtPayload = { nickname: user.nick, _id: user._id.toString() };
        return {
            accessToken: this.jwtService.sign(payload),
            userId: payload._id,
        };
    }

    async processLocal(email: string, password: string) {
        const user = await this.usersModel.findOne({ "local.email": email });
        if (!user) {
            return null;
        }

        const passwdMatches = await bcrypt.compare(password, user.local.password);

        if (!passwdMatches) {
            return null;
        }
        
        if (!user.verified) {
            return null;
        }
        
        return user;
    }

    async processWeb3(address: string, message: string, signed: string, currentUserId?: string) {
        try {
            const user = await this.usersModel.findOne({ "web3.address": address });
    
            // user already linked
            if (user && currentUserId) {
                throw new Error();
            }
    
            // basic login
            if (user) {
                return user;
            }
            
            // USER WANTS TO LINK A TWITTER ACCOUNT
            if (currentUserId) {
                const userToLink = await this.usersModel.findById(currentUserId);

                // invalid _id
                if (!userToLink) {
                    throw new Error();
                }

                userToLink.web3 = {
                    address, message, signed
                }
                return await userToLink.save();
            } else {
                const newUser = new this.usersModel({
                    nick: address.substring(0, 6),
                    web3: {
                        address, message, signed
                    },
                    verified: true,
                });
                return await newUser.save();
            }
        } catch (error) {
            return null;
        }
    }

    async processTwitter(profile: any, token: string, currentUserId?: string) {
        try {
            const user = await this.usersModel.findOne({ 'twitter.id' : profile.id });

            // user already linked
            if (user && currentUserId) {
                throw new Error();
            }

            // basic login
            if (user) {
                return user;
            }

            // USER WANTS TO LINK A TWITTER ACCOUNT
            if (currentUserId) {
                const userToLink = await this.usersModel.findById(currentUserId);
                // invalid _id
                if (!userToLink) {
                    throw new Error();
                }

                userToLink.twitter = {
                    id: profile.id,
                    token: token,
                    name: profile.displayName,
                }
                return await userToLink.save();
            } else {
                const newUser = new this.usersModel({
                    nick: profile.displayName,
                    twitter: {
                        id: profile.id,
                        token: token,
                        name: profile.displayName,
                    },
                    verified: true,
                });
                return await newUser.save();
            }
        } catch (error) {
            return null;
        }
    }

    async processGoogle(profile: any, token: string, currentUserId?: string) {
        try {
            const user = await this.usersModel.findOne({ 'google.id' : profile.id });

            // user already linked
            if (user && currentUserId) {
                throw new Error();
            }

            // basic login
            if (user) {
                return user;
            }

            // USER WANTS TO LINK A GOOGLE ACCOUNT
            if (currentUserId) {
                const userToLink = await this.usersModel.findById(currentUserId);

                // invalid _id
                if (!userToLink) {
                    throw new Error();
                }

                userToLink.google = {
                    id: profile.id,
                    token: token,
                    name: profile.displayName,
                    email: profile.emails[0].value
                };

                return await userToLink.save();
            } else {
                const newUser = new this.usersModel({
                    nick: profile.displayName,
                    google: {
                        id: profile.id,
                        token: token,
                        name: profile.displayName,
                        email: profile.emails[0].value
                    },
                    verified: true,
                });
                return await newUser.save();
            }
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    async processFacebook(profile: any, token: string, currentUserId?: string) {
        try {
            const user = await this.usersModel.findOne({ 'facebook.id' : profile.id });

            // user already linked
            if (user && currentUserId) {
                throw new Error();
            }

            // basic login
            if (user) {
                return user;
            }

            // USER WANTS TO LINK A GOOGLE ACCOUNT
            if (currentUserId) {
                const userToLink = await this.usersModel.findById(currentUserId);

                // invalid _id
                if (!userToLink) {
                    throw new Error();
                }

                userToLink.facebook = {
                    id: profile.id,
                    token: token,
                    name: profile.displayName,
                };

                return await userToLink.save();
            } else {
                // if there is no user, create 
                var newUser = new this.usersModel({
                    nick: profile.displayName,
                    facebook: {
                        id: profile.id,
                        token: token,
                        name: profile.displayName,
                    },
                    verified: true,
                });

                return await newUser.save();
            }
        } catch (error) {
            return null;
        }
    }
}