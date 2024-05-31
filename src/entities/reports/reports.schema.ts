import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { CommentDocument } from "src/entities/comments/comments.schema";
import { PostDocument } from "src/entities/posts/posts.schema";
import { UserDocument } from "src/entities/users/users.schema";

export type ReportDocument = HydratedDocument<Report>;

@Schema({ timestamps: true })
export class Report {
    @Prop({ required: true })
    contactReason: string;

    @Prop()
    email: string;

    @Prop({ required: true })
    message: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true })
    reportOwner: UserDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', autopopulate: true })
    reportedPost: PostDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', autopopulate: true })
    reportedComment: CommentDocument;

    @Prop({ default: false })
    isClosed: boolean;
}

export const ReportSchema = SchemaFactory.createForClass(Report);