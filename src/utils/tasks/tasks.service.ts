import { Injectable } from '@nestjs/common';
import { SchedulerRegistry,  } from '@nestjs/schedule';
import { CronJob } from "cron";
import { TTask } from './types';
import { PlannedTasksService } from 'src/entities/planned-tasks/planned-tasks.service';



@Injectable()
export class TasksService {
    constructor(
        private scheduleRegistry: SchedulerRegistry,
        private plannedTasksService: PlannedTasksService,
    ) {}

    private getUniqueTaskName(_id: string, taskType: TTask["taskType"]) {
        return `${taskType}:${_id}`;
    }

    async addCronJob(_id: string, date: Date, cb: () => void, taskType: TTask["taskType"]) {
        const job = new CronJob(date, cb);
        this.scheduleRegistry.addCronJob(this.getUniqueTaskName(_id, taskType), job);
    }

    async cancelCronJob(_id: string, taskType: TTask["taskType"]) {
        this.scheduleRegistry.deleteCronJob(this.getUniqueTaskName(_id, taskType));
    }
}
