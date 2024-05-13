import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class ChatCreationDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    owner: string;

    @IsArray()
    participants?: string[];
}