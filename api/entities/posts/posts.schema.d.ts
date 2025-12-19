import mongoose, { HydratedDocument } from "mongoose";
import { UserDocument } from "src/entities/users/users.schema";
export type PostDocument = HydratedDocument<Post>;
export declare class Post {
    owner: UserDocument;
    title: string;
    description: string;
    audio: string;
    image: string;
    likes: number;
    saves: number;
    category: string;
    downloadsAllowed: boolean;
}
export declare const PostSchema: mongoose.Schema<Post, mongoose.Model<Post, any, any, any, mongoose.Document<unknown, any, Post> & Post & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Post, mongoose.Document<unknown, {}, mongoose.FlatRecord<Post>> & mongoose.FlatRecord<Post> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
