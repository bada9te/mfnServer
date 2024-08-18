import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlannedTask } from './planned-tasks.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto';

@Injectable()
export class PlannedTasksService {
    constructor(@InjectModel(PlannedTask.name) private plannedTasksModel: Model<PlannedTask>) {}

    async createPlannedTask(dto: CreateTaskDto) {
        const inserted = await this.plannedTasksModel.insertMany([dto]);
        return inserted[0];
    }

    async deletePlannedTask(taskType: string, relatedEntityId: string) {
        return await this.plannedTasksModel.findOneAndDelete({taskType, relatedEntityId});
    }

    async getAllTasks() {
        return await this.plannedTasksModel.find();
    }
}
