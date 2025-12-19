import { Battle } from './battles.schema';
import { Model } from 'mongoose';
import { CreateBattleDto, MakeBattleVoteDto } from './dto';
import { RangeDto } from 'src/common/dto';
import { TasksService } from 'src/utils/tasks/tasks.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PostsService } from '../posts/posts.service';
export declare class BattlesService {
    private battlesModel;
    private tasksService;
    private notificationsService;
    private postsService;
    constructor(battlesModel: Model<Battle>, tasksService: TasksService, notificationsService: NotificationsService, postsService: PostsService);
    addBattleByIds(battle: CreateBattleDto): Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, Battle> & Battle & {
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
    getBattleById(_id: string): Promise<import("mongoose").Document<unknown, {}, Battle> & Battle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    deleteBattle(_id: string): Promise<import("mongoose").Document<unknown, {}, Battle> & Battle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    setWinnerByBattleId(_id: string): Promise<import("mongoose").Document<unknown, {}, Battle> & Battle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getAllBattlesByStatus(finished: boolean, range: RangeDto): Promise<(import("mongoose").Document<unknown, {}, Battle> & Battle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    updateScore({ battleId, postNScore, voteCount, voterId }: MakeBattleVoteDto): Promise<import("mongoose").Document<unknown, {}, Battle> & Battle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    getDocsCount(filter: any): Promise<number>;
    getBattlesUserParticipatedIn(userId: string, range: RangeDto): Promise<(import("mongoose").Document<unknown, {}, Battle> & Battle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
}
