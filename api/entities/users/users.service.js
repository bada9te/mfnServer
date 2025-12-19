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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_schema_1 = require("./users.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const moderations_service_1 = require("../moderations/moderations.service");
const bcrypt = require("bcrypt");
const email_service_1 = require("../../utils/email/email.service");
const posts_service_1 = require("../posts/posts.service");
const achievements_service_1 = require("../achievements/achievements.service");
let UsersService = class UsersService {
    constructor(userModel, moderationsService, emailService, postsService, achievementsService) {
        this.userModel = userModel;
        this.moderationsService = moderationsService;
        this.emailService = emailService;
        this.postsService = postsService;
        this.achievementsService = achievementsService;
    }
    async addUser(user) {
        const userInDB = await this.userModel.findOne({ "local.email": user.email });
        if (userInDB) {
            throw new common_1.BadRequestException("User already exists");
        }
        const toInsert = {
            nick: user.nick,
            local: {
                email: user.email,
                password: await bcrypt.hash(user.password, await bcrypt.genSalt(8))
            }
        };
        const inserted = await this.userModel.create(toInsert);
        const moderation = await this.moderationsService.createModeration({
            user: inserted._id.toString(),
            type: "verify",
        });
        this.emailService.sendVerificationEmail(inserted.local.email, inserted.nick, `${process.env.CLIENT_BASE}/account-verify/${inserted._id}/${moderation._id}/${moderation.verifyToken}/${moderation.type}`, moderation.verifyToken);
        return {
            user: inserted,
            action: moderation,
        };
    }
    async updateUser(_id, value, what) {
        return await this.userModel.findOneAndUpdate({ _id }, { [what]: value }, { new: true });
    }
    async getUserByEmail(email) {
        return await this.userModel.findOne({ 'local.email': email });
    }
    async getUserById(_id) {
        return await this.userModel.findById(_id);
    }
    async getUsersByIds(ids) {
        return await this.userModel.find({ _id: ids });
    }
    async getUsersByNickname(nick) {
        return await this.userModel.find({
            nick: { $regex: '.*' + nick + '.*' }
        }).limit(10);
    }
    async swicthUserSubscription(subscriberId, subscribeOnId) {
        const subscriberUSER = await this.userModel.findById(subscriberId);
        const subscribeOnUSER = await this.userModel.findById(subscribeOnId);
        if (!subscriberUSER.subscribedOn.find(i => i._id.toString() === subscribeOnUSER._id.toString())) {
            const subscriber = await this.userModel.findByIdAndUpdate(subscriberId, { $push: { subscribedOn: subscribeOnUSER._id } }, { new: true });
            const subscribeOn = await this.userModel.findByIdAndUpdate(subscribeOnId, { $push: { subscribers: subscriberUSER._id } }, { new: true });
            return { subscriber, subscribeOn };
        }
        else {
            const subscriber = await this.userModel.findByIdAndUpdate(subscriberId, { $pull: { subscribedOn: subscribeOnUSER._id } }, { new: true });
            const subscribeOn = await this.userModel.findByIdAndUpdate(subscribeOnId, { $pull: { subscribers: subscriberUSER._id } }, { new: true });
            return { subscriber, subscribeOn };
        }
    }
    async confirmUserAccount(dto) {
        const action = await this.moderationsService.validateAction({
            ...dto,
            type: 'verify',
        });
        const checkUser = await this.getUserById(dto.userId);
        if (!action || !checkUser) {
            throw new common_1.BadRequestException('Invalid verification credentials');
        }
        await this.moderationsService.deleteModeration({
            ...dto,
            type: 'verify',
        });
        const user = await this.userModel.findByIdAndUpdate(dto.userId, { verified: true }, { new: true });
        return { action, user };
    }
    async restoreAccount({ userId, actionId, verifyToken, type, newValue }) {
        const action = await this.moderationsService.validateAction({
            userId,
            actionId,
            verifyToken,
            type,
        });
        if (!action) {
            throw new common_1.BadRequestException('Invalid verification credentials');
        }
        let textType = "";
        if (type === "password") {
            type = "local.password";
            textType = "PASSWORD";
            newValue = await bcrypt.hash(newValue, await bcrypt.genSalt(8));
        }
        else if (type === "email") {
            type = "local.email";
            textType = "EMAIL";
            const user = await this.getUserByEmail(newValue);
            if (user) {
                throw new common_1.BadRequestException("This email was already taken");
            }
        }
        else if (type == "link-email") {
            type = "local.email";
            textType = "EMAIL";
            const user = await this.getUserByEmail(newValue);
            if (user) {
                throw new common_1.BadRequestException("This email was already taken");
            }
        }
        const affectedUser = await this.userModel.findByIdAndUpdate(userId, { [type]: newValue });
        if (!affectedUser) {
            throw new common_1.BadRequestException("User data can't be updated");
        }
        await this.moderationsService.deleteModeration({
            actionId,
            userId,
            type,
            verifyToken,
        });
        this.emailService.sendInformationEmail(type == "local.email" ? newValue : affectedUser.local.email, affectedUser.nick, `Your account ${textType} was successfully updated.`);
        return { action, user: affectedUser };
    }
    async prepareAccountToRestore({ email, type }) {
        const user = await this.getUserByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException("User not found");
        }
        const moderation = await this.moderationsService.createModeration({
            user: user._id.toString(),
            type,
        });
        this.emailService.sendRestorationEmail(user.local.email, user.nick, `${process.env.CLIENT_BASE}/account-restore/${user._id}/${moderation._id}/${moderation.verifyToken}/${type}`);
        return { action: moderation, user };
    }
    async calculateAchievements(userId) {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new common_1.BadRequestException("User not found");
        }
        const data = await this.postsService.getPostsLikesAndSavesByOwner(user._id.toString());
        if (data[0]) {
            const { postCount, totalLikes, totalSaves, singlePostMaxLikes, singlePostmaxSaves, } = data[0];
            const achievements = [];
            if (postCount > 0) {
                achievements.push(1);
                if (postCount >= 100) {
                    achievements.push(8);
                    postCount >= 250 && achievements.push(12);
                }
                if (totalLikes > 0) {
                    achievements.push(2);
                    totalLikes >= 1000 && achievements.push(4);
                    singlePostMaxLikes >= 2500 && achievements.push(5);
                    totalLikes >= 5000 && achievements.push(7);
                    totalLikes >= 10000 && achievements.push(9);
                    singlePostMaxLikes >= 10000 && achievements.push(13);
                }
                if (totalSaves > 0) {
                    achievements.push(3);
                    singlePostmaxSaves >= 1000 && achievements.push(6);
                    totalSaves >= 5000 && achievements.push(10);
                }
                if (totalLikes + totalSaves >= 20000) {
                    achievements.push(11);
                    totalLikes + totalSaves >= 50000 && achievements.push(14);
                    totalLikes + totalSaves >= 100000 && achievements.push(15);
                    totalLikes >= 500000 && totalSaves >= 500000 && achievements.push(18);
                    totalLikes + totalSaves >= 1000000 && achievements.push(19);
                }
            }
            user.achievements = Array.from(new Set([...user.achievements, ...achievements]));
            await user.save();
            const totalRP = (await this.achievementsService.getAllAchievements())
                .filter(i => achievements.includes(i.posNumber))
                .reduce((prev, curr) => prev + curr.rp, 0);
            return {
                ...data[0],
                achievements,
                totalRP,
            };
        }
        else {
            return {
                achievements: [],
                totalRP: 0,
                totalLikes: 0,
                totalSaves: 0,
                maxLikesByPost: 0,
                maxSavesByPost: 0,
                postCount: 0,
            };
        }
    }
    async unlinkGoogle(userId) {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new common_1.BadRequestException();
        }
        user.google = null;
        return await user.save();
    }
    async unlinkFacebook(userId) {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new common_1.BadRequestException();
        }
        user.facebook = null;
        return await user.save();
    }
    async unlinkTwitter(userId) {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new common_1.BadRequestException();
        }
        user.twitter = null;
        return await user.save();
    }
    async switchPostInSaved(postId, userId) {
        const user = await this.userModel.findById(userId);
        const post = await this.postsService.getPostById(postId);
        if (user.savedPosts.map(i => i._id.toString()).includes(post._id.toString())) {
            user.savedPosts = user.savedPosts.filter(i => i._id.toString() !== post._id.toString());
            post.saves--;
        }
        else {
            user.savedPosts.push(post);
            post.saves++;
        }
        await post.save();
        await user.save();
        return { user, post };
    }
    async switchPostInLiked(postId, userId) {
        const user = await this.userModel.findById(userId);
        const post = await this.postsService.getPostById(postId);
        if (user.likedPosts.map(i => i._id.toString()).includes(post._id.toString())) {
            user.likedPosts = user.likedPosts.filter(i => i._id.toString() !== post._id.toString());
            post.likes--;
        }
        else {
            user.likedPosts.push(post);
            post.likes++;
        }
        await post.save();
        await user.save();
        return { user, post };
    }
    async switchPostPinned(postId, userId) {
        const user = await this.userModel.findById(userId);
        const post = await this.postsService.getPostById(postId);
        if (user.pinnedPosts.map(i => i._id.toString()).includes(post._id.toString())) {
            user.pinnedPosts = user.pinnedPosts.filter(i => i._id.toString() !== post._id.toString());
        }
        else {
            user.pinnedPosts.push(post);
        }
        await user.save();
        return user;
    }
    async getPinnedPosts(userId) {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new common_1.BadRequestException();
        }
        return user.pinnedPosts;
    }
    async linkEmailRequest(newEmail, userId) {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new common_1.BadRequestException();
        }
        const userByEmail = await this.getUserByEmail(newEmail);
        if (userByEmail) {
            throw new common_1.BadRequestException();
        }
        const moderation = await this.moderationsService.createModeration({
            user: user._id.toString(),
            type: "link-email",
        });
        this.emailService.sendEmailLinkingEmail(newEmail, user.nick, `${process.env.CLIENT_BASE}/account-restore/${user._id}/${moderation._id}/${moderation.verifyToken}/link-email`);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        moderations_service_1.ModerationsService,
        email_service_1.EmailService,
        posts_service_1.PostsService,
        achievements_service_1.AchievementsService])
], UsersService);
//# sourceMappingURL=users.service.js.map