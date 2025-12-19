import { SchedulerRegistry } from '@nestjs/schedule';
import { TTask } from './types';
import { PlannedTasksService } from 'src/entities/planned-tasks/planned-tasks.service';
import { BattlesService } from 'src/entities/battles/battles.service';
import { NotificationsService } from 'src/entities/notifications/notifications.service';
export declare class TasksService {
    private scheduleRegistry;
    private plannedTasksService;
    private battlesService;
    private notificationsService;
    constructor(scheduleRegistry: SchedulerRegistry, plannedTasksService: PlannedTasksService, battlesService: BattlesService, notificationsService: NotificationsService);
    private getUniqueTaskName;
    addCronJob(_id: string, date: Date, cb: () => void, taskType: TTask["taskType"]): Promise<void>;
    cancelCronJob(_id: string, taskType: TTask["taskType"]): Promise<void>;
    reassignAllScheduledTasks(): Promise<void>;
}
