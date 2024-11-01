import { IsNotEmpty, IsString } from "class-validator"
import { CreateNotificationInput } from "src/graphql/graphql.schema";

export class CreateNotificationDto extends CreateNotificationInput {
    @IsNotEmpty()
    @IsString()
    receiver: string;

    @IsNotEmpty()
    @IsString()
    sender?: string;

    @IsString()
    post?: string;

    @IsString()
    battle?: string;
    
    @IsString()
    text: string;
}