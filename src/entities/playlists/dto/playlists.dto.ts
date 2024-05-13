import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class PlaylistCreationDto {
    @IsNotEmpty()
    @IsString()
    owner: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsBoolean()
    public: boolean;
}