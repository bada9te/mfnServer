import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Achievement } from "./achievements.schema";
import { Model } from "mongoose";

@Injectable()
export class AchievementsService {
    constructor(@InjectModel(Achievement.name) private achievementsModel: Model<Achievement>) {}

    async getAllAchievements() {
        return await this.achievementsModel.find({});
    }

    async achievementsByIds(ids: string[]) {
        return await this.achievementsModel.find({ _id: ids });
    }

    async achievementsByPos(pos: number[]) {
        return await this.achievementsModel.find({ posNumber: pos });
    }

    async achievemenmtsCount() {
        return await this.achievementsModel.estimatedDocumentCount();
    }
}