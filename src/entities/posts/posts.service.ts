import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './posts.schema';
import mongoose, { Model } from 'mongoose';
import { CreatePostDto } from './dto';
import { RangeDto } from 'src/common/dto';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postsModel: Model<Post>,
        @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
        private notificationsService: NotificationsService
    ) {}
    
    async addPost(post: CreatePostDto) {
        const inserted = await this.postsModel.insertMany([post]);
        const owner = await this.usersService.getUserById(post.owner);

        await this.notificationsService.createManyNotifications({
            from: post.owner,
            to: owner.subscribers.map(i => i._id.toString()),
            text: "Hey, user {user} has just uploaded a new track {post}",
            type: "POST_CREATED",
            entityType: "post",
            relatedEntityId: inserted[0]._id.toString(),
        });
        return inserted[0];
    }

    async updatePost(_id: string, value: any, what: string) {
        return await this.postsModel.findByIdAndUpdate(
            _id,
            { [what]: value },
            { new: true }
        );
    }

    async deletePostById(_id: string) {
        return await this.postsModel.findByIdAndDelete(_id);
    }

    async deletePostsByIds(ids: string[]) {
        return await this.postsModel.deleteMany({ _id: ids });
    }

    async getPostById(_id: string) {
        return await this.postsModel.findById(_id);
    }

    async getAllPosts(range: RangeDto) {
        return await this.postsModel.find({})
            .skip(range.offset)
            .limit(range.limit)
            .sort({ createdAt: -1 });
    }

    async getAllWithOwnerId(_id: string, range: RangeDto | null) {
        if (range) {
            return await this.postsModel.find({owner: _id})
                .skip(range.offset)
                .limit(range.limit)
                .sort({ createdAt: -1 });
        }
        return await this.postsModel.find({owner: _id})
                .sort({ createdAt: -1 });
    }

    async getSavedPostsByUserId(userId: string, range: RangeDto) {
        return await this.postsModel.find({ savedBy: userId })
            .skip(range.offset)
            .limit(range.limit)
            .sort({ createdAt: -1 });
    }

    async getByTitle(title: string) {
        return await this.postsModel.find({title: { $regex: '.*' + title + '.*' }});
    }

    async getByTitleWithUserId(title: string, useOwnerId: boolean, userId: string) {
        return await this.postsModel.find({
            title: { $regex: '.*' + title + '.*' },
            owner: useOwnerId === true ? userId : { "$ne": userId }
        });
    }

    async switchInSaved(postId: string, userId: string) {
        const userIdMongo = new mongoose.Types.ObjectId(userId);
        return await this.postsModel.findOneAndUpdate({ _id: postId }, [{
                $set: {
                    savedBy: {
                        $cond: [
                            { $in: [userIdMongo, "$savedBy"] },
                            { $setDifference: ["$savedBy", [userIdMongo]] },
                            { $concatArrays: ["$savedBy", [userIdMongo]] }
                        ]
                    }
                }
            }],
            { new: true }
        );
    }

    async switchIsLiked(postId: string, userId: string) {
        const userIdMongo = new mongoose.Types.ObjectId(userId);
        return await this.postsModel.findOneAndUpdate({ _id: postId }, [{
                $set: {
                    likedBy: {
                        $cond: [
                            { $in: [userIdMongo, "$likedBy"] },
                            { $setDifference: ["$likedBy", [userIdMongo]] },
                            { $concatArrays: ["$likedBy", [userIdMongo]] }
                        ]
                    }
                }
            }],
            { new: true }
        );
    }

    async getManyByIds(ids: string[]) {
        return await this.postsModel.find({ _id: ids });
    }

    async addOrRemoveComment(postId: string, commentId: string) {
        const commentIdMongo = new mongoose.Types.ObjectId(commentId);
        return await this.postsModel.findOneAndUpdate({ _id: postId }, [{
                $set: {
                    comments: {
                        $cond: [
                            { $in: [commentIdMongo, "$comments"] },
                            { $setDifference: ["$comments", [commentIdMongo]] },
                            { $concatArrays: ["$comments", [commentIdMongo]] },
                        ]
                    }
                }
            }],
            { new: true }
        );
    }
    
    
    async getMostPopularPostsByStartDate(date: Date) {
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
                    score: { $sum: [{ $size: "$likedBy" }, {$size: "$savedBy"}] }
                }
            },
        ]).sort({ score: -1 }).limit(3);
    }
    
    
    async getPostsByCategory(category: string, range: RangeDto)  {
        return await this.postsModel.find({ category })
            .skip(range.offset)
            .limit(range.limit)
            .sort({ createdAt: -1 });
    }

    async getDocsCount(filter: any) {
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
        }
    }

    async getPostsLikesAndSavesByOwner(userId: string) {
        return await this.postsModel.aggregate([
            // Match posts by owner
            { $match: { owner: new mongoose.Types.ObjectId(userId) } },
            
            // Calculate likes and saves counts
            {
                $project: {
                    likesCount: { $size: "$likedBy" },
                    savesCount: { $size: "$savedBy" }
                }
            },
            
            // Group by owner to calculate total likes, total saves, etc.
            {
                $group: {
                    _id: "$owner",
                    totalLikes: { $sum: "$likesCount" },
                    totalSaves: { $sum: "$savesCount" },
                    maxLikesByPost: { $max: "$likesCount" },
                    maxSavesByPost: { $max: "$savesCount" },
                    postCount: { $sum: 1 }
                }
            },
            
            // Lookup posts with max likes
            {
                $lookup: {
                    from: "posts", // Assuming the collection name is 'posts'
                    let: { maxLikes: "$maxLikesByPost" },
                    pipeline: [
                        { $match: { $expr: { $eq: [{ $size: "$likedBy" }, "$$maxLikes"] } } },
                        { $project: { _id: 1, likesCount: { $size: "$likedBy" } } }
                    ],
                    as: "postsWithMaxLikes"
                }
            },
            
            // Lookup posts with max saves
            {
                $lookup: {
                    from: "posts", // Assuming the collection name is 'posts'
                    let: { maxSaves: "$maxSavesByPost" },
                    pipeline: [
                        { $match: { $expr: { $eq: [{ $size: "$savedBy" }, "$$maxSaves"] } } },
                        { $project: { _id: 1, savesCount: { $size: "$savedBy" } } }
                    ],
                    as: "postsWithMaxSaves"
                }
            },
            
            // Project final output
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
}
