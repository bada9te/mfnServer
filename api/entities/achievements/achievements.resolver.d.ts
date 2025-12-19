import { AchievementsService } from "./achievements.service";
export declare class AchievementResolver {
    private achievementsService;
    constructor(achievementsService: AchievementsService);
    allAchievements(): Promise<(import("mongoose").Document<unknown, {}, import("./achievements.schema").Achievement> & import("./achievements.schema").Achievement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    achievementsByIds(ids: string[]): Promise<(import("mongoose").Document<unknown, {}, import("./achievements.schema").Achievement> & import("./achievements.schema").Achievement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    achievementsByPos(pos: number[]): Promise<(import("mongoose").Document<unknown, {}, import("./achievements.schema").Achievement> & import("./achievements.schema").Achievement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    achievemenmtsCount(): Promise<number>;
}
