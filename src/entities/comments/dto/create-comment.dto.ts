import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { AddCommentInput } from "src/graphql/graphql.schema";

export class CreateCommentDto extends AddCommentInput {
    @IsNotEmpty()
    @IsString()
    owner: string;

    @IsString()
    receiver?: string;

    @IsNotEmpty()
    @IsString()
    text: string;

    @IsNotEmpty()
    @IsBoolean()
    isReply: boolean;

    @IsString()
    isReplyTo?: string;

    @IsNotEmpty()
    @IsString()
    post: string;
}