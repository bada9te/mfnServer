import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { PostDocument } from "../../entities/posts/posts.schema";
import { UserDocument } from "../../entities/users/users.schema";

export type ReportDocument = HydratedDocument<Report>;

@Schema({ timestamps: true })
export class Report {
    @Prop({ type: String, required: true })
    contactReason: string;

    @Prop({ type: String, })
    email: string;

    @Prop({ type: String, required: true })
    message: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true })
    reportOwner: UserDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', autopopulate: true })
    reportedPost: PostDocument;

    @Prop({ type: Boolean, default: false })
    isClosed: boolean;
}

export const ReportSchema = SchemaFactory.createForClass(Report);