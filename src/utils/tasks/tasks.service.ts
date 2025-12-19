import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry,  } from '@nestjs/schedule';
import { CronJob } from "cron";
import { TTask } from './types';
import { PlannedTasksService } from '../../entities/planned-tasks/planned-tasks.service';
import { BattlesService } from '../../entities/battles/battles.service';
import { NotificationsService } from '../../entities/notifications/notifications.service';
import { timeout } from 'rxjs';


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
        const executionTime = new Date(date).getTime() - new Date().getTime();
        const timeout = setTimeout(cb, executionTime);
        this.plannedTasksService.createPlannedTask({relatedEntityId: _id, date: date.toString(), taskType});
        this.scheduleRegistry.addTimeout(this.getUniqueTaskName(_id, taskType), timeout);
    }

    async cancelCronJob(_id: string, taskType: TTask["taskType"]) {
        this.scheduleRegistry.deleteCronJob(this.getUniqueTaskName(_id, taskType));
        this.plannedTasksService.deletePlannedTask(taskType, _id);
    }

    async reassignAllScheduledTasks() {
        console.log("[CRON] Reassigning all tasks...");
        const tasks = await this.plannedTasksService.getAllTasks();

        tasks.forEach((task) => {
            let cb: () => void = () => {};
            switch (task.taskType) {
                case "FINISH_BATTLE":
                    cb = async() => {
                        try {
                            // delete task
                            await this.plannedTasksService.deletePlannedTask(task.taskType, task.relatedEntityId);
                            // get battle
                            const battle = await this.battlesService.setWinnerByBattleId(task.relatedEntityId);
                            // send notifications
                            await this.notificationsService.createManyNotifications({
                                from: battle?.initiator._id.toString() as string,
                                to: [battle?.post1.owner._id.toString(), battle?.post2.owner._id.toString()] as string[],
                                text: "",
                                type: "BATTLE_FINISHED",
                                entityType: "battle",
                                relatedEntityId: battle?._id.toString() as string,
                            });
                        } catch (error) {
                            console.log(`[FINSIH_BATTLE_ERROR] ${error}`)
                        }
                    };
                    break;
                
                default:
                    break;
            }

            const executionTime = new Date(task.date).getTime() - new Date().getTime();
            const timeout = setTimeout(cb, executionTime < 0 ? 1 : executionTime);
            this.scheduleRegistry.addTimeout(this.getUniqueTaskName(task.relatedEntityId, task.taskType as any), timeout);
        });

        console.log("[CRON] Reassigning all tasks... Done.");
    }
}
