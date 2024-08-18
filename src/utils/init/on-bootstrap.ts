import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { TasksService } from "../tasks/tasks.service";

@Injectable()
export class OnApplicationBootstrapService implements OnApplicationBootstrap {
    constructor (private tasksService: TasksService) {};

    onApplicationBootstrap() {
        this.tasksService.reassignAllScheduledTasks();
    }
}