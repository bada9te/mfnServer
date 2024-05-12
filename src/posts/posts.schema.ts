import { Prop, Schema } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Comment } from "src/comments/comments.schema";
import { User } from "src/users/users.schema";


export type PostDocument = HydratedDocument<Post>;


@Schema({ timestamps: true })
export class Post {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    owner: User;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    audio: string;

    @Prop({ required: true })
    image: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    likedBy: User[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    savedBy: User[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
    comments: Comment[];

    @Prop({ required: true })
    category: string;

    @Prop({ required: true })
    downloadsAllowed: boolean;

    @Prop({ required: true })
    commentsAllowed: boolean;
}