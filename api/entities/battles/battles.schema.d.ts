import mongoose, { HydratedDocument } from "mongoose";
import { PostDocument } from "src/entities/posts/posts.schema";
import { UserDocument } from "src/entities/users/users.schema";
export type BattleDocument = HydratedDocument<Battle>;
export declare class Battle {
    title: string;
    chainId: number;
    contractAddress: string;
    initiator: UserDocument;
    post1: PostDocument;
    post2: PostDocument;
    post1Score: number;
    post2Score: number;
    winner: PostDocument;
    willFinishAt: Date;
    finished: boolean;
    votedBy: UserDocument;
}
export declare const BattleSchema: mongoose.Schema<Battle, mongoose.Model<Battle, any, any, any, mongoose.Document<unknown, any, Battle> & Battle & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Battle, mongoose.Document<unknown, {}, mongoose.FlatRecord<Battle>> & mongoose.FlatRecord<Battle> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
