import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Comment } from "src/entities/comments/comments.schema";
import { Post } from "src/entities/posts/posts.schema";
import { User } from "src/entities/users/users.schema";

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    receiver: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    sender: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post'})
    post: Post;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
    comment: Comment;

    @Prop({ required: true })
    text: string;

    @Prop({ default: false })
    checked: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);