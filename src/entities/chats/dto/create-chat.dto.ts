import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { ChatCreateInput } from "src/graphql/graphql.schema";

export class CreateChatDto extends ChatCreateInput {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    owner: string;

    @IsArray()
    participants?: string[];
}