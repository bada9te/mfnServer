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
exports.UsersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const users_service_1 = require("./users.service");
const dto_1 = require("./dto");
const common_1 = require("@nestjs/common");
const gql_guard_1 = require("../../auth/strategy/graphql/gql.guard");
const gql_decorator_1 = require("../../auth/strategy/graphql/gql.decorator");
const swicth_like_or_save_dto_1 = require("./dto/swicth-like-or-save.dto");
let UsersResolver = class UsersResolver {
    constructor(usersService) {
        this.usersService = usersService;
    }
    validateUserAccess(userId, currentUser) {
        if (currentUser._id.toString() !== userId.toString()) {
            throw new common_1.BadRequestException('User access violation!');
        }
    }
    async whoAmI(user) {
        return this.usersService.getUserById(user._id.toString());
    }
    async user(_id) {
        return await this.usersService.getUserById(_id);
    }
    async userByEmail(email) {
        return await this.usersService.getUserByEmail(email);
    }
    async usersByIds(ids) {
        return await this.usersService.getUsersByIds(ids);
    }
    async usersByNickname(nick) {
        return await this.usersService.getUsersByNickname(nick);
    }
    async userAchievementsData(_id) {
        return await this.usersService.calculateAchievements(_id);
    }
    async userPinnedTracks(_id) {
        return await this.usersService.getPinnedPosts(_id);
    }
    async userCreate(input) {
        return await this.usersService.addUser(input);
    }
    async userUpdate({ _id, what, value }, user) {
        this.validateUserAccess(_id, user);
        return await this.usersService.updateUser(_id, value, what);
    }
    async userSwitchSubscription({ subscriberId, userId }, user) {
        this.validateUserAccess(subscriberId, user);
        return await this.usersService.swicthUserSubscription(subscriberId, userId);
    }
    async userConfirmAccount(dto) {
        return await this.usersService.confirmUserAccount(dto);
    }
    async userRestoreAccount(dto) {
        return await this.usersService.restoreAccount(dto);
    }
    async userPrepareAccountToRestore(dto) {
        return await this.usersService.prepareAccountToRestore(dto);
    }
    async userUnlinkGoogle(_id, user) {
        this.validateUserAccess(_id, user);
        return await this.usersService.unlinkGoogle(_id);
    }
    async userUnlinkFacebook(_id, user) {
        if (user._id.toString() !== _id.toString()) {
            throw new common_1.BadRequestException('User access violation!');
        }
        return await this.usersService.unlinkFacebook(_id);
    }
    async userUnlinkTwitter(_id, user) {
        this.validateUserAccess(_id, user);
        return await this.usersService.unlinkTwitter(_id);
    }
    async userSwitchLike(dto, user) {
        this.validateUserAccess(dto.userId, user);
        return await this.usersService.switchPostInLiked(dto.postId, dto.userId);
    }
    async userSwitchSave(dto, user) {
        this.validateUserAccess(dto.userId, user);
        return await this.usersService.switchPostInSaved(dto.postId, dto.userId);
    }
    async userSwitchPostPinned(userId, postId, user) {
        this.validateUserAccess(userId, user);
        return await this.usersService.switchPostPinned(postId, userId);
    }
    async userLinkEmailRequest(input, user) {
        this.validateUserAccess(input.userId, user);
        return await this.usersService.linkEmailRequest(input.email, input.userId);
    }
};
exports.UsersResolver = UsersResolver;
__decorate([
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "whoAmI", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "user", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userByEmail", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "usersByIds", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('nick')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "usersByNickname", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userAchievementsData", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userPinnedTracks", null);
__decorate([
    (0, graphql_1.Mutation)(),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userCreate", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userUpdate", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SwicthSubscriptionDto, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userSwitchSubscription", null);
__decorate([
    (0, graphql_1.Mutation)(),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ConfirmAccountDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userConfirmAccount", null);
__decorate([
    (0, graphql_1.Mutation)(),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RestoreAccountDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userRestoreAccount", null);
__decorate([
    (0, graphql_1.Mutation)(),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PrepareToRestoreDto]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userPrepareAccountToRestore", null);
__decorate([
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(),
    __param(0, (0, graphql_1.Args)('_id')),
    __param(1, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userUnlinkGoogle", null);
__decorate([
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(),
    __param(0, (0, graphql_1.Args)('_id')),
    __param(1, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userUnlinkFacebook", null);
__decorate([
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(),
    __param(0, (0, graphql_1.Args)('_id')),
    __param(1, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userUnlinkTwitter", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [swicth_like_or_save_dto_1.SwicthLikeOrSaveDto, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userSwitchLike", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [swicth_like_or_save_dto_1.SwicthLikeOrSaveDto, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userSwitchSave", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('userId')),
    __param(1, (0, graphql_1.Args)('postId')),
    __param(2, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userSwitchPostPinned", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LinkEmailDto, Object]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "userLinkEmailRequest", null);
exports.UsersResolver = UsersResolver = __decorate([
    (0, graphql_1.Resolver)('User'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersResolver);
//# sourceMappingURL=users.resolver.js.map