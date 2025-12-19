import { HydratedDocument } from "mongoose";
export type AchievementDocument = HydratedDocument<Achievement>;
export declare class Achievement {
    title: string;
    achievement: string;
    description: string;
    type: "basic" | "likes-total" | "saves-total" | "likes" | "saves" | "likes-and-saves" | "tracks" | "likes-and-saves-equals";
    rarity: "legendary" | "uncommon" | "rare" | "common";
    posNumber: number;
    rp: number;
}
export declare const AchievementSchema: import("mongoose").Schema<Achievement, import("mongoose").Model<Achievement, any, any, any, import("mongoose").Document<unknown, any, Achievement> & Achievement & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Achievement, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Achievement>> & import("mongoose").FlatRecord<Achievement> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
