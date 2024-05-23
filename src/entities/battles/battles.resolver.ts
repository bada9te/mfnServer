import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { BattlesService } from "./battles.service";
import { ParseBoolPipe, ParseIntPipe, UseGuards } from "@nestjs/common";
import { MakeBattleVoteDto } from "./dto";
import { GqlAuthGuard } from "src/auth/strategy/graphql/gql.guard";

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
    @UseGuards(GqlAuthGuard)
    async battleDeleteById(@Args('_id') _id: string) {
        return await this.battlesService.deleteBattle(_id);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async battleMakeVote(@Args('input') dto: MakeBattleVoteDto) {
        return await this.battlesService.updateScore(dto);
    }
}