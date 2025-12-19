// @ts-nocheck
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { CreatePlaylistInput } from "src/graphql/graphql.schema";

export class CreatePlaylistDto extends CreatePlaylistInput {
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