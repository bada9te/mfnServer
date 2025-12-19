import { OnApplicationBootstrap } from "@nestjs/common";
import { TasksService } from "../tasks/tasks.service";
import { AchievementsService } from "src/entities/achievements/achievements.service";
export declare class OnApplicationBootstrapService implements OnApplicationBootstrap {
    private tasksService;
    private achievementsService;
    constructor(tasksService: TasksService, achievementsService: AchievementsService);
    onApplicationBootstrap(): Promise<void>;
}
