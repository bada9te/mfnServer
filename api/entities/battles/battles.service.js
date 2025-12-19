"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattlesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const battles_schema_1 = require("./battles.schema");
const mongoose_2 = require("mongoose");
const tasks_service_1 = require("../../utils/tasks/tasks.service");
const notifications_service_1 = require("../notifications/notifications.service");
const posts_service_1 = require("../posts/posts.service");
let BattlesService = class BattlesService {
    constructor(battlesModel, tasksService, notificationsService, postsService) {
        this.battlesModel = battlesModel;
        this.tasksService = tasksService;
        this.notificationsService = notificationsService;
        this.postsService = postsService;
    }
    async addBattleByIds(battle) {
        const dateEnd = new Date();
        dateEnd.setHours(dateEnd.getHours() + 1);
        const battleToInsert = {
            ...battle,
            willFinishAt: dateEnd.toISOString(),
        };
        const inserted = await this.battlesModel.insertMany([battleToInsert]);
        const relatedPosts = await this.postsService.getManyByIds([battle.post1, battle.post2]);
        await this.notificationsService.createManyNotifications({
            from: battle.initiator,
            to: relatedPosts.map(i => i.owner._id.toString()),
            text: "",
            type: "BATTLE_CREATED",
            entityType: "battle",
            relatedEntityId: inserted[0]._id.toString(),
        });
        this.tasksService.addCronJob(inserted[0]._id.toString(), new Date(inserted[0].willFinishAt), async () => {
            this.setWinnerByBattleId(inserted[0]._id.toString());
            await this.notificationsService.createManyNotifications({
                from: battle.initiator,
                to: relatedPosts.map(i => i.owner._id.toString()),
                text: "",
                type: "BATTLE_FINISHED",
                entityType: "battle",
                relatedEntityId: inserted[0]._id.toString(),
            });
        }, "FINISH_BATTLE");
        return inserted[0];
    }
    async getBattleById(_id) {
        return await this.battlesModel.findById(_id);
    }
    async deleteBattle(_id) {
        return await this.battlesModel.findByIdAndDelete(_id);
    }
    async setWinnerByBattleId(_id) {
        const battle = await this.battlesModel.findById(_id);
        if (!battle) {
            throw new Error('Battle not found');
        }
        let winner;
        if (battle.post1Score > battle.post2Score) {
            winner = battle.post1;
        }
        else if (battle.post2Score > battle.post1Score) {
            winner = battle.post2;
        }
        else {
            winner = null;
        }
        return await this.battlesModel.findByIdAndUpdate(_id, {
            $set: {
                winner: winner,
                finished: true,
            }
        }, { new: true });
    }
    async getAllBattlesByStatus(finished, range) {
        return await this.battlesModel.find({ finished })
            .skip(range.offset)
            .limit(range.limit)
            .populate({
            path: 'post1.owner',
            select: 'name avatar',
        })
            .populate({
            path: 'post2.owner',
            select: 'name avatar',
        })
            .sort({ createdAt: -1 });
    }
    async updateScore({ battleId, postNScore, voteCount, voterId }) {
        return await this.battlesModel.findOneAndUpdate({ _id: battleId }, {
            $inc: { [postNScore]: voteCount },
            $push: { votedBy: voterId },
        }, { new: true });
    }
    async getDocsCount(filter) {
        return await this.battlesModel.countDocuments(filter).exec();
    }
    async getBattlesUserParticipatedIn(userId, range) {
        return await this.battlesModel.find({
            $or: [{ initiator: userId }, { votedBy: userId }]
        })
            .skip(range.offset)
            .limit(range.limit)
            .sort({ createdAt: -1 });
        ;
    }
};
exports.BattlesService = BattlesService;
exports.BattlesService = BattlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(battles_schema_1.Battle.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        tasks_service_1.TasksService,
        notifications_service_1.NotificationsService,
        posts_service_1.PostsService])
], BattlesService);
//# sourceMappingURL=battles.service.js.map