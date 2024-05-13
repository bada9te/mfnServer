import { IsNotEmpty, IsString } from "class-validator";

export class ModerationCreationDto {
    @IsNotEmpty()
    @IsString()
    user: string;

    @IsString()
    actionId?: string;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    verifyToken: string;
}