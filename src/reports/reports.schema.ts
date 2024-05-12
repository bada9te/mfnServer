import { Prop, Schema } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Comment } from "src/comments/comments.schema";
import { Post } from "src/posts/posts.schema";
import { User } from "src/users/users.schema";

export type ReportDocument = HydratedDocument<Report>;

@Schema({ timestamps: true })
export class Report {
    @Prop({ required: true })
    contactReason: string;

    @Prop()
    email: string;

    @Prop({ required: true })
    message: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    reportOwner: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    reportedPost: Post;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
    reportedComment: Comment;

    @Prop({ default: false })
    isClosed: boolean;
}