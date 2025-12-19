import { Args, Resolver, Query, Mutation } from "@nestjs/graphql";
import { ReportsService } from "./reports.service";
import { CreateReportDto } from "./dto";
import { ParseIntPipe, UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../../auth/strategy/graphql/gql.guard";


@Resolver('Report')
export class ReportsResolver {
    constructor(private reportsService: ReportsService) {}

    @Query()
    @UseGuards(GqlAuthGuard)
    async reports(
        @Args('offset', ParseIntPipe) offset: number,
        @Args('limit', ParseIntPipe) limit: number,
    ) {
        return await this.reportsService.getAllReports({offset, limit});
    }

    @Query()
    @UseGuards(GqlAuthGuard)
    async report(@Args('_id') _id: string) {
        return await this.reportsService.getReportById(_id);
    }

    @Mutation()
    async reportCreate(@Args('input') dto: CreateReportDto) {
        return await this.reportsService.createReport(dto);
    }

    @Mutation()
    @UseGuards(GqlAuthGuard)
    async reportClose(@Args('_id') _id: string) {
        return await this.reportsService.closeReport(_id);
    }
}