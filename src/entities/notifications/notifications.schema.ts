import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { CommentDocument } from "src/entities/comments/comments.schema";
import { PostDocument } from "src/entities/posts/posts.schema";
import { UserDocument } from "src/entities/users/users.schema";

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    receiver: UserDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    sender: UserDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post'})
    post: PostDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
    comment: CommentDocument;

    @Prop({ required: true })
    text: string;

    @Prop({ default: false })
    checked: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);