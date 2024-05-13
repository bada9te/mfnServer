import { IsNotEmpty, IsString } from "class-validator";

export class ChatMessageCreationDto {
    @IsNotEmpty()
    @IsString()
    owner: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsString()
    text?: string;

    @IsString()
    image?: string;

    @IsString()
    video?: string;

    @IsString()
    audio?: string;

    @IsString()
    file?: string;

    @IsString()
    spotify?: string;

    @IsString()
    reply?: string;

    @IsString()
    chat?: string;

    @IsString()
    toUser?: string;

    @IsString()
    sharedItem?: string;
}