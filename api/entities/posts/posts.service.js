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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const posts_schema_1 = require("./posts.schema");
const mongoose_2 = require("mongoose");
const notifications_service_1 = require("../notifications/notifications.service");
const users_service_1 = require("../users/users.service");
const population_1 = require("../../utils/constants/population");
let PostsService = class PostsService {
    constructor(postsModel, notificationsService, usersService) {
        this.postsModel = postsModel;
        this.notificationsService = notificationsService;
        this.usersService = usersService;
    }
    async addPost(post) {
        const inserted = await this.postsModel.insertMany([post], { populate: ["owner"] });
        const owner = inserted[0].owner;
        await this.notificationsService.createManyNotifications({
            from: post.owner,
            to: owner.subscribers.map(i => i._id.toString()),
            text: "",
            type: "POST_CREATED",
            entityType: "post",
            relatedEntityId: inserted[0]._id.toString(),
        });
        return inserted[0];
    }
    async updatePost(_id, value, what) {
        return await this.postsModel.findByIdAndUpdate(_id, { [what]: value }, { new: true });
    }
    async deletePostById(_id) {
        return await this.postsModel.findByIdAndDelete(_id);
    }
    async deletePostsByIds(ids) {
        return await this.postsModel.deleteMany({ _id: ids });
    }
    async getPostById(_id) {
        return await this.postsModel.findById(_id).populate(population_1.ownerPopulationObject);
    }
    async getAllPosts(range) {
        return await this.postsModel.find({})
            .skip(range.offset)
            .limit(range.limit)
            .populate(population_1.ownerPopulationObject)
            .sort({ createdAt: -1 });
    }
    async getAllWithOwnerId(_id, range) {
        if (range) {
            return await this.postsModel.find({ owner: _id })
                .skip(range.offset)
                .limit(range.limit)
                .populate(population_1.ownerPopulationObject)
                .sort({ createdAt: -1 });
        }
        return await this.postsModel.find({ owner: _id })
            .sort({ createdAt: -1 });
    }
    async getByTitle(title) {
        return await this.postsModel.find({ title: { $regex: '.*' + title + '.*' } }).populate(population_1.ownerPopulationObject);
    }
    async getByTitleWithUserId(title, useOwnerId, userId) {
        return await this.postsModel.find({
            title: { $regex: '.*' + title + '.*' },
            owner: useOwnerId === true ? userId : { "$ne": userId }
        }).populate(population_1.ownerPopulationObject);
    }
    async getManyByIds(ids) {
        return await this.postsModel.find({ _id: ids }).populate(population_1.ownerPopulationObject);
    }
    async getMostPopularPostsByStartDate(date) {
        return await this.postsModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: date }
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            {
                $set: {
                    owner: { $first: "$owner" }
                }
            },
            {
                $addFields: {
                    score: { $sum: [{ $size: "$likes" }, { $size: "$saves" }] }
                }
            },
        ]).sort({ score: -1 }).limit(3);
    }
    async getPostsByCategory(category, range) {
        return await this.postsModel.find({ category })
            .skip(range.offset)
            .limit(range.limit)
            .populate(population_1.ownerPopulationObject)
            .sort({ createdAt: -1 });
    }
    async getSavedPostsByUserId(userId, range) {
        const user = await this.usersService.getUserById(userId);
        return await this.postsModel.find({ _id: user.savedPosts })
            .skip(range.offset)
            .limit(range.limit)
            .populate(population_1.ownerPopulationObject);
    }
    async getDocsCount(filter) {
        if (filter) {
            return await this.postsModel.countDocuments(filter).exec();
        }
        return await this.postsModel.estimatedDocumentCount();
    }
    async getDocsCountByCategories() {
        return {
            country: await this.postsModel.countDocuments({ category: "country" }).exec(),
            pop: await this.postsModel.countDocuments({ category: "pop" }).exec(),
            classical: await this.postsModel.countDocuments({ category: "classical" }).exec(),
            funk: await this.postsModel.countDocuments({ category: "funk" }).exec(),
            soul: await this.postsModel.countDocuments({ category: "soul" }).exec(),
            hipHop: await this.postsModel.countDocuments({ category: "hip-hop" }).exec(),
            rock: await this.postsModel.countDocuments({ category: "rock" }).exec(),
            electronic: await this.postsModel.countDocuments({ category: "electronic" }).exec(),
            latin: await this.postsModel.countDocuments({ category: "latin" }).exec(),
            jazz: await this.postsModel.countDocuments({ category: "jazz" }).exec(),
            blues: await this.postsModel.countDocuments({ category: "blues" }).exec(),
            folk: await this.postsModel.countDocuments({ category: "folk" }).exec(),
            metal: await this.postsModel.countDocuments({ category: "metal" }).exec(),
            reggae: await this.postsModel.countDocuments({ category: "reggae" }).exec(),
        };
    }
    async getPostsLikesAndSavesByOwner(userId) {
        return await this.postsModel.aggregate([
            { $match: { owner: new mongoose_2.default.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: "$owner",
                    totalLikes: { $sum: "$likes" },
                    totalSaves: { $sum: "$saves" },
                    maxLikesByPost: { $max: "$likes" },
                    maxSavesByPost: { $max: "$saves" },
                    postCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "posts",
                    let: { maxLikes: "$maxLikesByPost" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$likes", "$$maxLikes"] } } },
                        { $project: { _id: 1, likes: 1 } }
                    ],
                    as: "postsWithMaxLikes"
                }
            },
            {
                $lookup: {
                    from: "posts",
                    let: { maxSaves: "$maxSavesByPost" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$saves", "$$maxSaves"] } } },
                        { $project: { _id: 1, saves: 1 } }
                    ],
                    as: "postsWithMaxSaves"
                }
            },
            {
                $project: {
                    _id: 0,
                    totalLikes: 1,
                    totalSaves: 1,
                    maxLikesByPost: 1,
                    maxSavesByPost: 1,
                    postCount: 1,
                    maxLikesPostId: { $arrayElemAt: ["$postsWithMaxLikes._id", 0] },
                    maxSavesPostId: { $arrayElemAt: ["$postsWithMaxSaves._id", 0] }
                }
            }
        ]);
    }
    async getMostRecentTracks() {
        return await this.postsModel.find({}).sort({ createdAt: -1 }).limit(10);
    }
    async getMostRecentTracksByFollowing(userId) {
        const user = await this.usersService.getUserById(userId);
        return await this.postsModel
            .find({ owner: user.subscribedOn })
            .sort({ createdAt: -1 })
            .populate(population_1.ownerPopulationObject)
            .limit(10);
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(posts_schema_1.Post.name)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notifications_service_1.NotificationsService,
        users_service_1.UsersService])
], PostsService);
//# sourceMappingURL=posts.service.js.map