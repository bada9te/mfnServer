import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PlannedTask } from './planned-tasks.schema';
import { Model } from 'mongoose';

@Injectable()
export class PlannedTasksService {
    constructor(@InjectModel(PlannedTask.name) private plannedTasksModel: Model<PlannedTask>) {}
}
