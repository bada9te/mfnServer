import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CommentCreationDto {
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