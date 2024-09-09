import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { TasksService } from "../tasks/tasks.service";
import { AchievementsService } from "src/entities/achievements/achievements.service";
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class OnApplicationBootstrapService implements OnApplicationBootstrap {
    constructor (private tasksService: TasksService, private achievementsService: AchievementsService) {};

    async onApplicationBootstrap() {
        this.tasksService.reassignAllScheduledTasks();

        // check for achievements existance in DB
        const achievementsCount = await this.achievementsService.achievemenmtsCount();
        if (!achievementsCount) {
            const targetPath = path.join('public', 'static_data', 'achievements.json');
            console.log("TARGET PATH:", targetPath);
            const data = fs.readFileSync(targetPath, 'utf-8');
            await this.achievementsService.insertAchievements(JSON.parse(data));
        }
    }
}