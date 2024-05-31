import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { PostDocument } from "src/entities/posts/posts.schema";
import { UserDocument } from "src/entities/users/users.schema";


export type CommentDocument = HydratedDocument<Comment>;


@Schema({ timestamps: true })
export class Comment {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true })
    owner: UserDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true })
    receiver: UserDocument;

    @Prop({ required: true })
    text: string;

    @Prop({ default: false })
    isReply: boolean;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', autopopulate: true }] })
    replies: CommentDocument[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    post: PostDocument;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);