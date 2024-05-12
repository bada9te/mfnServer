import { Prop, Schema } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Post } from "src/entities/posts/posts.schema";
import { User } from "src/entities/users/users.schema";


export type PlaylistDocument = HydratedDocument<Playlist>;


@Schema({ timestamps: true })
export class Playlist {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    owner: User;

    @Prop({ required: true })
    title: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
    tracks: Post[];

    @Prop({ default: false })
    public: boolean;
}