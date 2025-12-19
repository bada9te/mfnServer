// @ts-nocheck
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { AddPostInput } from "../../../graphql/graphql.schema";

export class CreatePostDto extends AddPostInput {
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
    downloadsAllowed: boolean;
}