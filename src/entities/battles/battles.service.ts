import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Battle } from './battles.schema';
import mongoose, { Model } from 'mongoose';
import { CreateBattleDto, MakeBattleVoteDto } from './dto';
import { RangeDto } from 'src/common/dto';
import { TasksService } from 'src/utils/tasks/tasks.service';


@Injectable()
export class BattlesService {
    constructor(
        @InjectModel(Battle.name) private battlesModel: Model<Battle>,
        private tasksService: TasksService,
    ) {}
    
    async addBattleByIds(battle: CreateBattleDto) {
        const dateEnd = new Date();
        dateEnd.setDate(dateEnd.getDate() + 1);

        const battleToInsert = {
            ...battle,
            willFinishAt: dateEnd.toISOString(),
        };
        const inserted = await this.battlesModel.insertMany([battleToInsert]);
        
        // create CRON TASK TO FINISH BATTLE
        this.tasksService.addCronJob(
            inserted[0]._id.toString(), 
            new Date(inserted[0].willFinishAt), 
            () => {
                this.setWinnerByBattleId(inserted[0]._id.toString());
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
        const battle = await this.battlesModel.findById(_id).exec();
        
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
        ).exec();
    }    

    async getAllBattlesByStatus(finished: boolean, range: RangeDto) {
        return await this.battlesModel.find({ finished })
            .skip(range.offset)
            .limit(range.limit)
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
}
