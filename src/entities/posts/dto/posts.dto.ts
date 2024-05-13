import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class PostCreationDto {
    @IsNotEmpty()
    @IsString()
    owner: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    audio: string;

    @IsNotEmpty()
    @IsString()
    image: string;

    @IsNotEmpty()
    @IsString()
    category: string;

    @IsNotEmpty()
    @IsBoolean()
    commentsAllowed: boolean;

    @IsNotEmpty()
    @IsBoolean()
    downloadsAllowed: boolean;
}