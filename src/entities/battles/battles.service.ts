import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Battle } from './battles.schema';
import { Model } from 'mongoose';
import { CreateBattleDto, MakeBattleVoteDto } from './dto';
import { RangeDto } from 'src/common/dto';
import { TasksService } from 'src/utils/tasks/tasks.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PostsService } from '../posts/posts.service';


@Injectable()
export class BattlesService {
    constructor(
        @InjectModel(Battle.name) private battlesModel: Model<Battle>,
        private tasksService: TasksService,
        private notificationsService: NotificationsService,
        private postsService: PostsService,
    ) {}
    
    async addBattleByIds(battle: CreateBattleDto) {
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
        
        // create CRON TASK TO FINISH BATTLE
        this.tasksService.addCronJob(
            inserted[0]._id.toString(), 
            new Date(inserted[0].willFinishAt), 
            async() => {
                this.setWinnerByBattleId(inserted[0]._id.toString());
                // send notifications
                await this.notificationsService.createManyNotifications({
                    from: battle.initiator,
                    to: relatedPosts.map(i => i.owner._id.toString()),
                    text: "",
                    type: "BATTLE_FINISHED",
                    entityType: "battle",
                    relatedEntityId: inserted[0]._id.toString(),
                });
            }, 
            "FINISH_BATTLE"
        );

        return inserted[0];
    }

    async getBattleById(_id: string) {
        return await this.battlesModel.findById(_id);
    }

    async deleteBattle(_id: string) {
        return await this.battlesModel.findByIdAndDelete(_id);
    }

    async setWinnerByBattleId(_id: string) {
        // Fetch the battle document
        const battle = await this.battlesModel.findById(_id);
        
        if (!battle) {
            throw new Error('Battle not found');
        }
    
        // Determine the winner
        let winner;
        if (battle.post1Score > battle.post2Score) {
            winner = battle.post1;
        } else if (battle.post2Score > battle.post1Score) {
            winner = battle.post2;
        } else {
            winner = null;
        }
    
        // Update the document with the winner
        return await this.battlesModel.findByIdAndUpdate(
            _id,
            {
                $set: {
                    winner: winner,
                    finished: true,
                }
            },
            { new: true }
        );
    }    

    async getAllBattlesByStatus(finished: boolean, range: RangeDto) {
        return await this.battlesModel.find({ finished })
            .skip(range.offset)
            .limit(range.limit)
            .populate({
                path: 'post1.owner', // Explicitly populate owner for post1
                select: 'name avatar', // You can limit fields for owner here
            })
            .populate({
                path: 'post2.owner', // If you have a post2 field as well
                select: 'name avatar',
            })
            .sort({ createdAt: -1 });
    }

    async updateScore({battleId, postNScore, voteCount, voterId}: MakeBattleVoteDto) {
        return await this.battlesModel.findOneAndUpdate(
            { _id: battleId }, 
            { 
                $inc: { [postNScore]: voteCount },
                $push: { votedBy: voterId },
            },
            { new: true }
        )
    }

    async getDocsCount(filter: any) {
        return await this.battlesModel.countDocuments(filter).exec();
    }

    async getBattlesUserParticipatedIn(userId: string, range: RangeDto) {
        return await this.battlesModel.find({
            $or: [{ initiator: userId }, { votedBy: userId }]
        })
        .skip(range.offset)
        .limit(range.limit)
        .sort({ createdAt: -1 });;
    }
}
