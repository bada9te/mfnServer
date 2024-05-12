import { Prop, Schema } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Post } from "src/posts/posts.schema";
import { User } from "src/users/users.schema";


export type CommentDocument = HydratedDocument<Comment>;


@Schema({ timestamps: true })
export class Comment {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    owner: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    receiver: User;

    @Prop({ required: true })
    text: string;

    @Prop({ default: false })
    isReply: boolean;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
    replies: Comment[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    post: Post;
}