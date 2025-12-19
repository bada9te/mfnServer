"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_schema_1 = require("../../../entities/users/users.schema");
const bcrypt = require("bcrypt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let JwtAuthService = class JwtAuthService {
    constructor(usersModel, jwtService) {
        this.usersModel = usersModel;
        this.jwtService = jwtService;
    }
    async login(user) {
        const payload = { nickname: user.nick, _id: user._id.toString() };
        return {
            accessToken: this.jwtService.sign(payload),
            userId: payload._id,
        };
    }
    async processLocal(email, password) {
        const user = await this.usersModel.findOne({ "local.email": email }).select('local.password verified');
        ;
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
    async processWeb3(address, message, signed, currentUserId) {
        try {
            const user = await this.usersModel.findOne({ "web3.address": address });
            if (user && currentUserId) {
                throw new Error();
            }
            if (user) {
                return user;
            }
            if (currentUserId) {
                const userToLink = await this.usersModel.findById(currentUserId);
                if (!userToLink) {
                    throw new Error();
                }
                userToLink.web3 = {
                    address, message, signed
                };
                return await userToLink.save();
            }
            else {
                const newUser = new this.usersModel({
                    nick: address.substring(0, 6),
                    web3: {
                        address, message, signed
                    },
                    verified: true,
                });
                return await newUser.save();
            }
        }
        catch (error) {
            return null;
        }
    }
    async processTwitter(profile, token, currentUserId) {
        try {
            const user = await this.usersModel.findOne({ 'twitter.id': profile.id });
            if (user && currentUserId) {
                throw new Error();
            }
            if (user) {
                return user;
            }
            if (currentUserId) {
                const userToLink = await this.usersModel.findById(currentUserId);
                if (!userToLink) {
                    throw new Error();
                }
                userToLink.twitter = {
                    id: profile.id,
                    token: token,
                    name: profile.displayName,
                };
                return await userToLink.save();
            }
            else {
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
        }
        catch (error) {
            return null;
        }
    }
    async processGoogle(profile, token, currentUserId) {
        try {
            const user = await this.usersModel.findOne({ 'google.id': profile.id });
            if (user && currentUserId) {
                throw new Error();
            }
            if (user) {
                return user;
            }
            if (currentUserId) {
                const userToLink = await this.usersModel.findById(currentUserId);
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
            }
            else {
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
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    async processFacebook(profile, token, currentUserId) {
        try {
            const user = await this.usersModel.findOne({ 'facebook.id': profile.id });
            if (user && currentUserId) {
                throw new Error();
            }
            if (user) {
                return user;
            }
            if (currentUserId) {
                const userToLink = await this.usersModel.findById(currentUserId);
                if (!userToLink) {
                    throw new Error();
                }
                userToLink.facebook = {
                    id: profile.id,
                    token: token,
                    name: profile.displayName,
                };
                return await userToLink.save();
            }
            else {
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
        }
        catch (error) {
            return null;
        }
    }
};
exports.JwtAuthService = JwtAuthService;
exports.JwtAuthService = JwtAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], JwtAuthService);
//# sourceMappingURL=jwt.service.js.map