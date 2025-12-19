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
exports.AchievementResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const achievements_service_1 = require("./achievements.service");
let AchievementResolver = class AchievementResolver {
    constructor(achievementsService) {
        this.achievementsService = achievementsService;
    }
    async allAchievements() {
        return await this.achievementsService.getAllAchievements();
    }
    async achievementsByIds(ids) {
        return await this.achievementsService.achievementsByIds(ids);
    }
    async achievementsByPos(pos) {
        return await this.achievementsService.achievementsByPos(pos);
    }
    async achievemenmtsCount() {
        return await this.achievementsService.achievemenmtsCount();
    }
};
exports.AchievementResolver = AchievementResolver;
__decorate([
    (0, graphql_1.Query)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AchievementResolver.prototype, "allAchievements", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AchievementResolver.prototype, "achievementsByIds", null);
__decorate([
    (0, graphql_1.Query)(),
    __param(0, (0, graphql_1.Args)('pos')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AchievementResolver.prototype, "achievementsByPos", null);
__decorate([
    (0, graphql_1.Query)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AchievementResolver.prototype, "achievemenmtsCount", null);
exports.AchievementResolver = AchievementResolver = __decorate([
    (0, graphql_1.Resolver)('Achievement'),
    __metadata("design:paramtypes", [achievements_service_1.AchievementsService])
], AchievementResolver);
//# sourceMappingURL=achievements.resolver.js.map