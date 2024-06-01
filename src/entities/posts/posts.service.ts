import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './posts.schema';
import mongoose, { Model } from 'mongoose';
import { CreatePostDto } from './dto';
import { RangeDto } from 'src/common/dto';

@Injectable()
export class PostsService {
    constructor(@InjectModel(Post.name) private postsModel: Model<Post>) {}
    
    async addPost(post: CreatePostDto) {
        const inserted = await this.postsModel.insertMany([post]);
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

    async getAllWithOwnerId(_id: string, range: RangeDto) {
        return await this.postsModel.find({owner: _id})
            .skip(range.offset)
            .limit(range.limit)
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
        return await this.postsModel.countDocuments(filter).exec();
    }

    async getDocsCountByCategories() {
        return {
            country: await this.postsModel.countDocuments({ category: "Country" }).exec(),
            pop: await this.postsModel.countDocuments({ category: "Pop" }).exec(),
            classical: await this.postsModel.countDocuments({ category: "Classical" }).exec(),
            funk: await this.postsModel.countDocuments({ category: "Funk" }).exec(),
            soulMusic: await this.postsModel.countDocuments({ category: "Soul Music" }).exec(),
            hipHop: await this.postsModel.countDocuments({ category: "Hip Hop" }).exec(),
            rock: await this.postsModel.countDocuments({ category: "Rock" }).exec(),
            electronicMusic: await this.postsModel.countDocuments({ category: "Electronic Music" }).exec(),
            latin: await this.postsModel.countDocuments({ category: "Latin" }).exec(),
            jazz: await this.postsModel.countDocuments({ category: "Jazz" }).exec(),
            blues: await this.postsModel.countDocuments({ category: "Blues" }).exec(),
            folk: await this.postsModel.countDocuments({ category: "Folk" }).exec(),
            metal: await this.postsModel.countDocuments({ category: "Metal" }).exec(),
        }
    }
}
