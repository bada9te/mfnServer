import { IsNotEmpty, IsString } from "class-validator";
import { CreateReportInput } from "src/graphql/graphql.schema";

export class CreateReportDto extends CreateReportInput {
    @IsString()
    @IsNotEmpty()
    contactReason: string;

    @IsString()
    email?: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    reportOwner?: string;

    @IsString()
    reportedPost?: string;
}