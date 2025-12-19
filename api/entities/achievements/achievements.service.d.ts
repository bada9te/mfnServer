import { Achievement } from "./achievements.schema";
import { Model } from "mongoose";
export declare class AchievementsService {
    private achievementsModel;
    constructor(achievementsModel: Model<Achievement>);
    getAllAchievements(): Promise<(import("mongoose").Document<unknown, {}, Achievement> & Achievement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    achievementsByIds(ids: string[]): Promise<(import("mongoose").Document<unknown, {}, Achievement> & Achievement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    achievementsByPos(pos: number[]): Promise<(import("mongoose").Document<unknown, {}, Achievement> & Achievement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    achievemenmtsCount(): Promise<number>;
    insertAchievements(achievements: any[]): Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, Achievement> & Achievement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }, Omit<any, "_id">>[]>;
}
