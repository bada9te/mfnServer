import { HydratedDocument } from "mongoose";
export type PlannedTaskDocument = HydratedDocument<PlannedTask>;
export declare class PlannedTask {
    relatedEntityId: string;
    date: Date;
    taskType: string;
}
export declare const PlannedTasksSchema: import("mongoose").Schema<PlannedTask, import("mongoose").Model<PlannedTask, any, any, any, import("mongoose").Document<unknown, any, PlannedTask> & PlannedTask & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PlannedTask, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<PlannedTask>> & import("mongoose").FlatRecord<PlannedTask> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
