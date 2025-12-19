import { Moderation } from './moderations.schema';
import { Model } from 'mongoose';
import { CreateModerationDto, ModerationDto } from './dto';
export declare class ModerationsService {
    private moderationsModel;
    constructor(moderationsModel: Model<Moderation>);
    createModeration(action: CreateModerationDto): Promise<import("mongoose").Document<unknown, {}, Moderation> & Moderation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    deleteModeration({ actionId, userId, verifyToken, type }: ModerationDto): Promise<import("mongoose").Document<unknown, {}, Moderation> & Moderation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    validateAction({ actionId, userId, verifyToken, type }: ModerationDto): Promise<import("mongoose").Document<unknown, {}, Moderation> & Moderation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
