import { Prop, Schema } from "@nestjs/mongoose";
import mongoose, { Date, HydratedDocument } from "mongoose";
import { Post } from "src/entities/posts/posts.schema";
import { User } from "src/entities/users/users.schema";

export type BattleDocument = HydratedDocument<Battle>;

@Schema({ timestamps: true })
export class Battle {
    @Prop({ required: true })
    title: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    post1: Post;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    post2: Post;

    @Prop({ default: 0 })
    post1Score: number;

    @Prop({ default: 0 })
    post2Score: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    winner: Post;

    @Prop({ required: true })
    willFinishAt: Date;

    @Prop({ default: false })
    finished: boolean;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    votedBy: User;
}