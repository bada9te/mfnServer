import { ReportsService } from "./reports.service";
import { CreateReportDto } from "./dto";
export declare class ReportsResolver {
    private reportsService;
    constructor(reportsService: ReportsService);
    reports(offset: number, limit: number): Promise<(import("mongoose").Document<unknown, {}, import("./reports.schema").Report> & import("./reports.schema").Report & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    report(_id: string): Promise<import("mongoose").Document<unknown, {}, import("./reports.schema").Report> & import("./reports.schema").Report & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    reportCreate(dto: CreateReportDto): Promise<import("mongoose").Document<unknown, {}, import("./reports.schema").Report> & import("./reports.schema").Report & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    reportClose(_id: string): Promise<import("mongoose").Document<unknown, {}, import("./reports.schema").Report> & import("./reports.schema").Report & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
}
