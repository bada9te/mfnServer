import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ModerationsService } from "./moderations.service";
import { CreateModerationDto, ModerationDto } from "./dto";

@Resolver('Moderation')
export class ModerationsResolver {
    constructor(private moderationsService: ModerationsService) {}

    @Query()
    async moderationActionValidate(@Args('input') input: ModerationDto) {
        return await this.moderationsService.validateAction(input);
    }

    @Mutation()
    async moderationActionCreate(@Args('input') input: CreateModerationDto) {
        return await this.moderationsService.createModeration(input);
    }

    @Mutation()
    async moderationActionDelete(@Args('input') input: ModerationDto) {
        return await this.moderationsService.deleteModeration(input);
    }
}