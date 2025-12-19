import mongoose, { HydratedDocument } from "mongoose";
import { PostDocument } from "src/entities/posts/posts.schema";
import { UserDocument } from "src/entities/users/users.schema";
export type PlaylistDocument = HydratedDocument<Playlist>;
export declare class Playlist {
    owner: UserDocument;
    title: string;
    tracks: PostDocument[];
    public: boolean;
}
export declare const PlaylistSchema: mongoose.Schema<Playlist, mongoose.Model<Playlist, any, any, any, mongoose.Document<unknown, any, Playlist> & Playlist & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Playlist, mongoose.Document<unknown, {}, mongoose.FlatRecord<Playlist>> & mongoose.FlatRecord<Playlist> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
