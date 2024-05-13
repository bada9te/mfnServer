import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { CommentDocument } from "src/entities/comments/comments.schema";
import { UserDocument } from "src/entities/users/users.schema";


export type PostDocument = HydratedDocument<Post>;


@Schema({ timestamps: true })
export class Post {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    owner: UserDocument;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    audio: string;

    @Prop({ required: true })
    image: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    likedBy: UserDocument[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    savedBy: UserDocument[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
    comments: CommentDocument[];

    @Prop({ required: true })
    category: string;

    @Prop({ required: true })
    downloadsAllowed: boolean;

    @Prop({ required: true })
    commentsAllowed: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);