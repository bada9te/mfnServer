import mongoose, { HydratedDocument } from "mongoose";
import { PostDocument } from "../posts/posts.schema";
export type UserDocument = HydratedDocument<User>;
export declare class User {
    local: {
        email: string;
        password: string;
    };
    facebook: Record<string, any>;
    twitter: Record<string, any>;
    google: Record<string, any>;
    web3: {
        address: string;
        message: string;
        signed: string;
    };
    nick: string;
    description: string;
    avatar: string;
    background: string;
    subscribers: UserDocument[];
    subscribedOn: UserDocument[];
    likedPosts: PostDocument[];
    savedPosts: PostDocument[];
    verified: boolean;
    level: number;
    achievements: number[];
    pinnedPosts: PostDocument[];
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User> & User & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, mongoose.FlatRecord<User>> & mongoose.FlatRecord<User> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
