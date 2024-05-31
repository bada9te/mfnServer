import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './comments.schema';
import mongoose, { Model } from 'mongoose';
import { CreateCommentDto } from './dto';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name) private commentsModel: Model<Comment>,
        private postsService: PostsService
    ) {}
    
    async addComment(comment: CreateCommentDto) {
        const inserted = await this.commentsModel.insertMany([comment]);
        const createdComment = inserted[0];

        if (createdComment.isReply) {
            await this.addReply(comment.isReplyTo, createdComment._id.toString());
        } else {
            await this.postsService.addOrRemoveComment(createdComment.post, createdComment._id.toString());
        }
        return createdComment;
    }

    async getById(_id: string) {
        return await this.commentsModel.findById(_id);
    }

    async removeById(_id: string) {
        const removedComment = await this.commentsModel.findByIdAndDelete(_id);
        await this.postsService.addOrRemoveComment(
            removedComment.post._id.toString(), 
            removedComment._id.toString()
        );
        return removedComment;
    }

    async updateById(_id: string, value: string, what: string) {
        return await this.commentsModel.findByIdAndUpdate(
            _id,
            { [what]: value },
            { new: true, upsert: true },
        );
    }

    async removeManyByIds(ids: string[]) {
        return await this.commentsModel.deleteMany({ _id: ids });
    }

    async getAllWithIds(ids: string[]) {
        return await this.commentsModel.find({ _id: ids });
    } 

    async getCommentReplies(_id: string) {
        return await this.commentsModel.findById(
            _id,
            { populate: "replies" }
        ).select({
            "replies": 1,
            "owner": 0,
        });
    }

    async addReply(_id: string, commentId: string) {
        return await this.commentsModel.findByIdAndUpdate(
            _id,
            { $push: { replies: commentId } },
            { new: true }
        );
    }

    async removeReply(_id: string, commentId: string) {
        return await this.commentsModel.findByIdAndUpdate(
            _id,
            { $pull: { replies: commentId } },
            { new: true }
        );
    }

    async getCommentsByPostId(postId: string) {
        return await this.commentsModel.find({
            post: postId
        }).sort({ createdAt: -1 });
    }
}
