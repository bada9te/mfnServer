import mongoose, { HydratedDocument } from "mongoose";
import { UserDocument } from "src/entities/users/users.schema";
export type ModerationDocument = HydratedDocument<Moderation>;
export declare class Moderation {
    user: UserDocument;
    type: string;
    verifyToken: string;
}
export declare const ModerationSchema: mongoose.Schema<Moderation, mongoose.Model<Moderation, any, any, any, mongoose.Document<unknown, any, Moderation> & Moderation & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Moderation, mongoose.Document<unknown, {}, mongoose.FlatRecord<Moderation>> & mongoose.FlatRecord<Moderation> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
