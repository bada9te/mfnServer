import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { PostDocument } from "src/entities/posts/posts.schema";
import { UserDocument } from "src/entities/users/users.schema";


export type PlaylistDocument = HydratedDocument<Playlist>;


@Schema({ timestamps: true })
export class Playlist {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    owner: UserDocument;

    @Prop({ required: true })
    title: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
    tracks: PostDocument[];

    @Prop({ default: false })
    public: boolean;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);