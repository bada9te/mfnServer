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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnApplicationBootstrapService = void 0;
const common_1 = require("@nestjs/common");
const tasks_service_1 = require("../tasks/tasks.service");
const achievements_service_1 = require("../../entities/achievements/achievements.service");
const path = require("path");
const fs = require("fs");
let OnApplicationBootstrapService = class OnApplicationBootstrapService {
    constructor(tasksService, achievementsService) {
        this.tasksService = tasksService;
        this.achievementsService = achievementsService;
    }
    ;
    async onApplicationBootstrap() {
        this.tasksService.reassignAllScheduledTasks();
        const achievementsCount = await this.achievementsService.achievemenmtsCount();
        if (!achievementsCount) {
            const targetPath = path.join('public', 'static_data', 'achievements.json');
            console.log("TARGET PATH:", targetPath);
            const data = fs.readFileSync(targetPath, 'utf-8');
            await this.achievementsService.insertAchievements(JSON.parse(data));
        }
    }
};
exports.OnApplicationBootstrapService = OnApplicationBootstrapService;
exports.OnApplicationBootstrapService = OnApplicationBootstrapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tasks_service_1.TasksService, achievements_service_1.AchievementsService])
], OnApplicationBootstrapService);
//# sourceMappingURL=on-bootstrap.js.map