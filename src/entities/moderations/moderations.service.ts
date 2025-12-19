import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Moderation } from './moderations.schema';
import { Model } from 'mongoose';
import { CreateModerationDto, ModerationDto } from './dto';
import generateRandomString from '../../utils/functions/generateRandomString';

@Injectable()
export class ModerationsService {
    constructor(@InjectModel(Moderation.name) private moderationsModel: Model<Moderation>) {}
    
    async createModeration(action: CreateModerationDto) {
        const actionWithVerifyToken = {
            ...action,
            verifyToken: generateRandomString(),
        }
        const inserted = await this.moderationsModel.create(actionWithVerifyToken);
        return inserted;
    }

    async deleteModeration({actionId, userId, verifyToken, type}: ModerationDto) {
        return await this.moderationsModel.findOneAndDelete({
            _id: actionId,
            user: userId,
            verifyToken,
            type,
        });
    }

    async validateAction({actionId, userId, verifyToken, type}: ModerationDto) {
        return await this.moderationsModel.findOne({
            _id: actionId,
            user: userId,
            verifyToken,
            type,
        });
    }
}
