import { PlannedTask } from './planned-tasks.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto';
export declare class PlannedTasksService {
    private plannedTasksModel;
    constructor(plannedTasksModel: Model<PlannedTask>);
    createPlannedTask(dto: CreateTaskDto): Promise<import("mongoose").Document<unknown, {}, PlannedTask> & PlannedTask & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    deletePlannedTask(taskType: string, relatedEntityId: string): Promise<import("mongoose").Document<unknown, {}, PlannedTask> & PlannedTask & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getAllTasks(): Promise<(import("mongoose").Document<unknown, {}, PlannedTask> & PlannedTask & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
}
