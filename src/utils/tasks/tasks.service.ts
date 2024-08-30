import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry,  } from '@nestjs/schedule';
import { CronJob } from "cron";
import { TTask } from './types';
import { PlannedTasksService } from 'src/entities/planned-tasks/planned-tasks.service';
import { BattlesService } from 'src/entities/battles/battles.service';
import { NotificationsService } from 'src/entities/notifications/notifications.service';


@Injectable()
export class TasksService {
    constructor(
        private scheduleRegistry: SchedulerRegistry,
        private plannedTasksService: PlannedTasksService,
        @Inject(forwardRef(() => BattlesService))
        private battlesService: BattlesService,
        private notificationsService: NotificationsService,
    ) {}

    private getUniqueTaskName(_id: string, taskType: TTask["taskType"]) {
        return `${taskType}:${_id}`;
    }

    async addCronJob(_id: string, date: Date, cb: () => void, taskType: TTask["taskType"]) {
        const job = new CronJob(date, cb);
        this.plannedTasksService.createPlannedTask({relatedEntityId: _id, date: date.toString(), taskType});
        this.scheduleRegistry.addCronJob(this.getUniqueTaskName(_id, taskType), job);
    }

    async cancelCronJob(_id: string, taskType: TTask["taskType"]) {
        this.scheduleRegistry.deleteCronJob(this.getUniqueTaskName(_id, taskType));
        this.plannedTasksService.deletePlannedTask(taskType, _id);
    }

    async reassignAllScheduledTasks() {
        console.log("[CRON] Reassigning all tasks...");
        const tasks = await this.plannedTasksService.getAllTasks();

        tasks.forEach((task) => {
            let cb: () => void;
            switch (task.taskType) {
                case "FINISH_BATTLE":
                    cb = async() => {
                        // get battle
                        const battle = await this.battlesService.setWinnerByBattleId(task.relatedEntityId);
                        // delete task
                        await this.plannedTasksService.deletePlannedTask(task.taskType, task.relatedEntityId);
                        // send notifications
                        await this.notificationsService.createManyNotifications({
                            from: battle.initiator._id.toString(),
                            to: [battle.post1.owner._id.toString(), battle.post2.owner._id.toString()],
                            text: "",
                            type: "BATTLE_FINISHED",
                            entityType: "battle",
                            relatedEntityId: battle._id.toString(),
                        });
                    };
                    break;
                
                default:
                    break;
            }

            const job = new CronJob(task.date, cb);
            this.scheduleRegistry.addCronJob(this.getUniqueTaskName(task.relatedEntityId, task.taskType as any), job);
        });

        console.log("[CRON] Reassigning all tasks... Done.");
    }
}
