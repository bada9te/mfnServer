import { Args, Resolver, Query, Mutation } from "@nestjs/graphql";
import { ReportsService } from "./reports.service";
import { CreateReportDto } from "./dto";


@Resolver('Report')
export class ReportsResolver {
    constructor(private reportsService: ReportsService) {}

    @Query()
    async reports(
        @Args('offset') offset: number,
        @Args('limit') limit: number,
    ) {
        return await this.reportsService.getAllReports({offset, limit});
    }

    @Query()
    async report(@Args('_id') _id: string) {
        return await this.reportsService.getReportById(_id);
    }

    @Mutation()
    async reportCreate(@Args('input') dto: CreateReportDto) {
        return await this.reportsService.createReport(dto);
    }

    @Mutation()
    async reportClose(@Args('_id') _id: string) {
        return await this.reportsService.closeReport(_id);
    }
}