import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { BattlesService } from "./battles.service";
import { ParseBoolPipe, ParseIntPipe } from "@nestjs/common";
import { MakeBattleVoteDto } from "./dto";

@Resolver('Battle')
export class BattlesResolver {
    constructor(private battlesService: BattlesService) {}

    @Query()
    async battlesByStatus(
        @Args('finished', ParseBoolPipe) finished: boolean,
        @Args('offset', ParseIntPipe) offset: number,
        @Args('limit', ParseIntPipe) limit: number,
    ) {
        return {
            battles: await this.battlesService.getAllBattlesByStatus(finished, {offset, limit}),
            count: await this.battlesService.getDocsCount({ finished }),
        }
    }

    // battleCreate

    @Mutation()
    async battleDeleteById(@Args('_id') _id: string) {
        return await this.battlesService.deleteBattle(_id);
    }

    @Mutation()
    async battleMakeVote(@Args('input') dto: MakeBattleVoteDto) {
        return await this.battlesService.updateScore(dto);
    }
}