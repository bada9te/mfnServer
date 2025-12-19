// @ts-nocheck
import { IsNotEmpty, IsString } from "class-validator";
import { CreateModerationActionInput } from "src/graphql/graphql.schema";

export class CreateModerationDto extends CreateModerationActionInput {
    @IsNotEmpty()
    @IsString()
    user: string;

    @IsNotEmpty()
    @IsString()
    type: string;
}