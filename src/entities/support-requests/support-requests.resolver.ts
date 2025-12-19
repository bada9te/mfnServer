import { Args, Resolver, Query, Mutation } from "@nestjs/graphql";
import { SupportRequestsService } from "./support-requests.service";
import { CreateSupportRequestDto } from "./dto";
import { ParseIntPipe, UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../../auth/strategy/graphql/gql.guard";

@Resolver('SuuportRequest')
export class SupportRequestsResolver {
    constructor(private supportRequestsService: SupportRequestsService) {}

    @Query()
    @UseGuards(GqlAuthGuard)
    async supportRequests(
        @Args('offset', ParseIntPipe) offset: number,
        @Args('limit', ParseIntPipe) limit: number,
    ) {
        return await this.supportRequestsService.getAllSupportRequsts({ offset, limit });
    }

    @Query()
    @UseGuards(GqlAuthGuard)
    async supportRequest(@Args('_id') _id: string) {
        return await this.supportRequestsService.getSupportRequestById(_id);
    }

    @Mutation()
    async supportRequestCreate(@Args('input') dto: CreateSupportRequestDto) {
        return await this.supportRequestsService.createSupportRequest(dto);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async supportRequestClose(@Args('_id') _id: string) {
        return await this.supportRequestsService.closeSupportRequest(_id);
    }
}