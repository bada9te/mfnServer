import { IsNotEmpty, IsString } from "class-validator";
import { AddNewBattleByPostsIdsInput } from "src/graphql/graphql.schema";

export class CreateBattleDto extends AddNewBattleByPostsIdsInput {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    post1: string;

    @IsNotEmpty()
    @IsString()
    post2: string;

    @IsNotEmpty()
    @IsString()
    initiator: string;
}