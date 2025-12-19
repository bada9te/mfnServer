import mongoose, { HydratedDocument } from "mongoose";
import { PostDocument } from "src/entities/posts/posts.schema";
import { UserDocument } from "src/entities/users/users.schema";
import { BattleDocument } from "../battles/battles.schema";
export type NotificationDocument = HydratedDocument<Notification>;
export declare class Notification {
    receiver: UserDocument;
    sender: UserDocument;
    post: PostDocument;
    battle: BattleDocument;
    type: "SUBSCRIBED" | "BATTLE_CREATED" | "BATTLE_FINISHED" | "POST_REPORTED" | "POST_CREATED" | "SYSTEM";
    text: string;
    checked: boolean;
}
export declare const NotificationSchema: mongoose.Schema<Notification, mongoose.Model<Notification, any, any, any, mongoose.Document<unknown, any, Notification> & Notification & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Notification, mongoose.Document<unknown, {}, mongoose.FlatRecord<Notification>> & mongoose.FlatRecord<Notification> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
