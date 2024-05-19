import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Battle } from './battles.schema';
import { Model } from 'mongoose';
import { CreateBattleDto, MakeBattleVoteDto } from './dto';
import { RangeDto } from 'src/common/dto';

@Injectable()
export class BattlesService {
    constructor(@InjectModel(Battle.name) private battlesModel: Model<Battle>) {}
    
    async addBattleByIds(battle: CreateBattleDto) {
        const dateEnd = new Date();
        dateEnd.setDate(dateEnd.getDate() + 1);

        const battleToInsert = {
            ...battle,
            willFinishAt: dateEnd.toISOString(),
        };
        const inserted = await this.battlesModel.insertMany([battleToInsert]);
        
        // TODO: create PLANNED TASK TO FINISH BATTLE

        return inserted[0];
    }

    async deleteBattle(_id: string) {
        return await this.battlesModel.findByIdAndDelete(_id);
    }

    async setWinnerByBattleId(_id: string) {
        return await this.battlesModel.findByIdAndUpdate(
            _id,
            {
                $set: {
                    winner: {
                        branches: [
                            {
                                case: { $gt: ["$post1Score", "$post2Score"] },
                                then: "$post1"
                            },
                            {
                                case: { $gt: ["$post2Score", "$post1Score"] },
                                then: "$post2"
                            },
                            {
                                case: { $eq: ["$post1Score", "$post2Score"] },
                                then: null,
                            }
                        ],
                    },
                    finished: true,
                }
            }
        );
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
