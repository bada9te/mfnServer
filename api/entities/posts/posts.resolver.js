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
exports.PostsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const posts_service_1 = require("./posts.service");
const dto_1 = require("./dto");
const common_1 = require("@nestjs/common");
const gql_guard_1 = require("../../auth/strategy/graphql/gql.guard");
const gql_decorator_1 = require("../../auth/strategy/graphql/gql.decorator");
let PostsResolver = class PostsResolver {
    constructor(postsService) {
        this.postsService = postsService;
    }
    validateUserAccess(userId, currentUser) {
        if (currentUser._id.toString() !== userId.toString()) {
            throw new common_1.BadRequestException('User access violation!');
        }
    }
    async post(_id) {
        return await this.postsService.getPostById(_id);
    }
    async posts(offset, limit) {
        return {
            posts: await this.postsService.getAllPosts({ offset, limit }),
            count: await this.postsService.getDocsCount({}),
        };
    }
    async postsByOwner(owner, offset, limit) {
        return {
            posts: await this.postsService.getAllWithOwnerId(owner, { offset, limit }),
            count: await this.postsService.getDocsCount({ owner }),
        };
    }
    async postsByTitle(dto) {
        const { userId, title, userIsOwner } = dto;
        if (userId) {
            return await this.postsService.getByTitleWithUserId(title, userIsOwner, userId);
        }
        else {
            return await this.postsService.getByTitle(title);
        }
    }
    async postsByIds(ids) {
        return await this.postsService.getManyByIds(ids);
    }
    async postsMostPopular(date) {
        return await this.postsService.getMostPopularPostsByStartDate(new Date(date));
    }
    async postsByCategory(category, offset, limit) {
        return {
            posts: await this.postsService.getPostsByCategory(category, { offset, limit }),
            count: await this.postsService.getDocsCount({ category }),
        };
    }
    async postsSavedByUser(user, offset, limit) {
        return {
            posts: await this.postsService.getSavedPostsByUserId(user, { offset, limit }),
            count: await this.postsService.getDocsCount({ savedBy: user }),
        };
    }
    async postsByCategoryCount() {
        return await this.postsService.getDocsCountByCategories();
    }
    async postsMostRecent() {
        return await this.postsService.getMostRecentTracks();
    }
    async postsMostRecentByFollowing(userId) {
        return await this.postsService.getMostRecentTracksByFollowing(userId);
    }
    async postCreate(dto, user) {
        this.validateUserAccess(dto.owner, user);
        return await this.postsService.addPost(dto);
    }
    async postUpdate({ post, value, what }, user) {
        const postData = await this.postsService.getPostById(post);
        this.validateUserAccess(postData.owner._id.toString(), user);
        return await this.postsService.updatePost(post, value, what);
    }
    async postDeleteById(_id, user) {
        const postData = await this.postsService.getPostById(_id);
        this.validateUserAccess(postData.owner._id.toString(), user);
        return await this.postsService.deletePostById(_id);
    }
};
exports.PostsResolver = PostsResolver;
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "post", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('offset', common_1.ParseIntPipe)),
    __param(1, (0, graphql_1.Args)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "posts", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('owner')),
    __param(1, (0, graphql_1.Args)('offset', common_1.ParseIntPipe)),
    __param(2, (0, graphql_1.Args)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "postsByOwner", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.PostsByTitleDto]),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "postsByTitle", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "postsByIds", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "postsMostPopular", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('category')),
    __param(1, (0, graphql_1.Args)('offset', common_1.ParseIntPipe)),
    __param(2, (0, graphql_1.Args)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "postsByCategory", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('user')),
    __param(1, (0, graphql_1.Args)('offset', common_1.ParseIntPipe)),
    __param(2, (0, graphql_1.Args)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "postsSavedByUser", null);
__decorate([
    (0, graphql_1.Query)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "postsByCategoryCount", null);
__decorate([
    (0, graphql_1.Query)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "postsMostRecent", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "postsMostRecentByFollowing", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "postCreate", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.UpdatePostDto, Object]),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "postUpdate", null);
__decorate([
    (0, graphql_1.Mutation)(),
    (0, common_1.UseGuards)(gql_guard_1.GqlAuthGuard),
    __param(0, (0, graphql_1.Args)('_id')),
    __param(1, (0, gql_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsResolver.prototype, "postDeleteById", null);
exports.PostsResolver = PostsResolver = __decorate([
    (0, graphql_1.Resolver)('Post'),
    __metadata("design:paramtypes", [posts_service_1.PostsService])
], PostsResolver);
//# sourceMappingURL=posts.resolver.js.map