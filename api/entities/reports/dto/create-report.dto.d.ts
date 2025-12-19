import { CreateReportInput } from "src/graphql/graphql.schema";
export declare class CreateReportDto extends CreateReportInput {
    contactReason: string;
    email?: string;
    message: string;
    reportOwner?: string;
    reportedPost?: string;
}
