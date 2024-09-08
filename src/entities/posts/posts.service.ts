import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './posts.schema';
import mongoose, { Model } from 'mongoose';
import { CreatePostDto } from './dto';
import { RangeDto } from 'src/common/dto';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';


@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postsModel: Model<Post>,
        private notificationsService: NotificationsService,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
    ) {}
    
    async addPost(post: CreatePostDto) {
        const inserted = await this.postsModel.insertMany([post], {populate: ["owner"]});
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
        return await this.postsModel.findById(_id).populate(["owner"]);
    }

    async getAllPosts(range: RangeDto) {
        return await this.postsModel.find({})
            .skip(range.offset)
            .limit(range.limit)
            .populate(["owner"])
            .sort({ createdAt: -1 });
    }

    async getAllWithOwnerId(_id: string, range: RangeDto | null) {
        if (range) {
            return await this.postsModel.find({owner: _id})
                .skip(range.offset)
                .limit(range.limit)
                .populate(["owner"])
                .sort({ createdAt: -1 });
        }
        return await this.postsModel.find({owner: _id})
                .sort({ createdAt: -1 });
    }


    async getByTitle(title: string) {
        return await this.postsModel.find({title: { $regex: '.*' + title + '.*' }}).populate(["owner"]);
    }

    async getByTitleWithUserId(title: string, useOwnerId: boolean, userId: string) {
        return await this.postsModel.find({
            title: { $regex: '.*' + title + '.*' },
            owner: useOwnerId === true ? userId : { "$ne": userId }
        }).populate(["owner"]);
    }


    async getManyByIds(ids: string[]) {
        return await this.postsModel.find({ _id: ids }).populate(["owner"]);
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
                    score: { $sum: [{ $size: "$likes" }, {$size: "$saves"}] }
                }
            },
        ]).sort({ score: -1 }).limit(3);
    }
    
    
    async getPostsByCategory(category: string, range: RangeDto)  {
        return await this.postsModel.find({ category })
            .skip(range.offset)
            .limit(range.limit)
            .populate(["owner"])
            .sort({ createdAt: -1 });
    }

    async getSavedPostsByUserId(userId: string, range: RangeDto) {
        const user = await this.usersService.getUserById(userId);
        return await this.postsModel.find({_id: user.savedPosts})
            .skip(range.offset)
            .limit(range.limit)
            .populate(["owner"]);
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
            
            // Group by owner to calculate total likes, total saves, etc.
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
            
            // Lookup posts with max likes
            {
                $lookup: {
                    from: "posts", // Assuming the collection name is 'posts'
                    let: { maxLikes: "$maxLikesByPost" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$likes", "$$maxLikes"] } } },
                        { $project: { _id: 1, likes: 1 } }
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
                        { $match: { $expr: { $eq: ["$saves", "$$maxSaves"] } } },
                        { $project: { _id: 1, saves: 1 } }
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
