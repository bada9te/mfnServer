import { ModerationsService } from "./moderations.service";
import { CreateModerationDto, ModerationDto } from "./dto";
export declare class ModerationsResolver {
    private moderationsService;
    constructor(moderationsService: ModerationsService);
    moderationActionValidate(input: ModerationDto): Promise<import("mongoose").Document<unknown, {}, import("./moderations.schema").Moderation> & import("./moderations.schema").Moderation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    moderationActionCreate(input: CreateModerationDto): Promise<import("mongoose").Document<unknown, {}, import("./moderations.schema").Moderation> & import("./moderations.schema").Moderation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    moderationActionDelete(input: ModerationDto): Promise<import("mongoose").Document<unknown, {}, import("./moderations.schema").Moderation> & import("./moderations.schema").Moderation & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
