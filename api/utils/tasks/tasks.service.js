"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const planned_tasks_service_1 = require("../../entities/planned-tasks/planned-tasks.service");
const battles_service_1 = require("../../entities/battles/battles.service");
const notifications_service_1 = require("../../entities/notifications/notifications.service");
let TasksService = class TasksService {
    constructor(scheduleRegistry, plannedTasksService, battlesService, notificationsService) {
        this.scheduleRegistry = scheduleRegistry;
        this.plannedTasksService = plannedTasksService;
        this.battlesService = battlesService;
        this.notificationsService = notificationsService;
    }
    getUniqueTaskName(_id, taskType) {
        return `${taskType}:${_id}`;
    }
    async addCronJob(_id, date, cb, taskType) {
        const executionTime = new Date(date).getTime() - new Date().getTime();
        const timeout = setTimeout(cb, executionTime);
        this.plannedTasksService.createPlannedTask({ relatedEntityId: _id, date: date.toString(), taskType });
        this.scheduleRegistry.addTimeout(this.getUniqueTaskName(_id, taskType), timeout);
    }
    async cancelCronJob(_id, taskType) {
        this.scheduleRegistry.deleteCronJob(this.getUniqueTaskName(_id, taskType));
        this.plannedTasksService.deletePlannedTask(taskType, _id);
    }
    async reassignAllScheduledTasks() {
        console.log("[CRON] Reassigning all tasks...");
        const tasks = await this.plannedTasksService.getAllTasks();
        tasks.forEach((task) => {
            let cb;
            switch (task.taskType) {
                case "FINISH_BATTLE":
                    cb = async () => {
                        try {
                            await this.plannedTasksService.deletePlannedTask(task.taskType, task.relatedEntityId);
                            const battle = await this.battlesService.setWinnerByBattleId(task.relatedEntityId);
                            await this.notificationsService.createManyNotifications({
                                from: battle.initiator._id.toString(),
                                to: [battle.post1.owner._id.toString(), battle.post2.owner._id.toString()],
                                text: "",
                                type: "BATTLE_FINISHED",
                                entityType: "battle",
                                relatedEntityId: battle._id.toString(),
                            });
                        }
                        catch (error) {
                            console.log(`[FINSIH_BATTLE_ERROR] ${error}`);
                        }
                    };
                    break;
                default:
                    break;
            }
            const executionTime = new Date(task.date).getTime() - new Date().getTime();
            const timeout = setTimeout(cb, executionTime < 0 ? 1 : executionTime);
            this.scheduleRegistry.addTimeout(this.getUniqueTaskName(task.relatedEntityId, task.taskType), timeout);
        });
        console.log("[CRON] Reassigning all tasks... Done.");
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => battles_service_1.BattlesService))),
    __metadata("design:paramtypes", [schedule_1.SchedulerRegistry,
        planned_tasks_service_1.PlannedTasksService,
        battles_service_1.BattlesService,
        notifications_service_1.NotificationsService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map