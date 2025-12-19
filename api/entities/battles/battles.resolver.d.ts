import { BattlesService } from "./battles.service";
import { CreateBattleDto, MakeBattleVoteDto } from "./dto";
export declare class BattlesResolver {
    private battlesService;
    constructor(battlesService: BattlesService);
    battlesByStatus(finished: boolean, offset: number, limit: number): Promise<{
        battles: (import("mongoose").Document<unknown, {}, import("./battles.schema").Battle> & import("./battles.schema").Battle & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        })[];
        count: number;
    }>;
    battleById(_id: string): Promise<import("mongoose").Document<unknown, {}, import("./battles.schema").Battle> & import("./battles.schema").Battle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    battlesUserParticipatedIn(userId: string, offset: number, limit: number): Promise<{
        battles: (import("mongoose").Document<unknown, {}, import("./battles.schema").Battle> & import("./battles.schema").Battle & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        })[];
        count: number;
    }>;
    battleCreate(dto: CreateBattleDto): Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, import("./battles.schema").Battle> & import("./battles.schema").Battle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }, Omit<{
        willFinishAt: string;
        title: string;
        post1: string;
        post2: string;
        initiator: string;
        chainId?: number;
        contractAddress?: string;
    }, "_id">>>;
    battleDeleteById(_id: string): Promise<import("mongoose").Document<unknown, {}, import("./battles.schema").Battle> & import("./battles.schema").Battle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    battleMakeVote(dto: MakeBattleVoteDto): Promise<import("mongoose").Document<unknown, {}, import("./battles.schema").Battle> & import("./battles.schema").Battle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
