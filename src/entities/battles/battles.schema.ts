import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { PostDocument } from "src/entities/posts/posts.schema";
import { UserDocument } from "src/entities/users/users.schema";

export type BattleDocument = HydratedDocument<Battle>;

@Schema({ timestamps: true })
export class Battle {
    @Prop({ required: true })
    title: string;

    @Prop({ required: false })
    chainId: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    initiator: UserDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', autopopulate: true })
    post1: PostDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', autopopulate: true })
    post2: PostDocument;

    @Prop({ default: 0 })
    post1Score: number;

    @Prop({ default: 0 })
    post2Score: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    winner: PostDocument;

    @Prop({ required: true })
    willFinishAt: Date;

    @Prop({ default: false })
    finished: boolean;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    votedBy: UserDocument;
}

export const BattleSchema = SchemaFactory.createForClass(Battle);