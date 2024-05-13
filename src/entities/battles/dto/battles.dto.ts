import { IsNotEmpty, IsString } from "class-validator";

export class BattleCreationDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    post1: string;

    @IsNotEmpty()
    @IsString()
    post2: string;
}