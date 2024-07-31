import { Args, Query, Resolver } from "@nestjs/graphql";
import { AchievementsService } from "./achievements.service";

@Resolver('Achievement')
export class AchievementResolver {
    constructor(private achievementsService: AchievementsService) {}

    @Query()
    async allAchievements() {
        return await this.achievementsService.getAllAchievements();
    }

    @Query()
    async achievementsByIds(@Args('ids') ids: string[]) {
        return await this.achievementsService.achievementsByIds(ids);
    }
}
