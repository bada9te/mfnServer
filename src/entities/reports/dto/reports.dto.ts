import { IsNotEmpty, IsString } from "class-validator";

export class ReportCreationDto {
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

    @IsString()
    reportedComment?: string;
}