import { IsArray, IsNotEmpty, IsString } from "class-validator"
import { Notification } from "../notifications.schema";

export class CreateManyNotificationsDto {
    @IsNotEmpty()
    @IsString()
    from: string;

    @IsNotEmpty()
    @IsString()
    text: string;

    @IsNotEmpty()
    @IsArray()
    to: string[];

    @IsNotEmpty()
    @IsString()
    relatedEntityId: string;

    @IsNotEmpty()
    @IsString()
    type: Notification["type"];

    @IsString()
    entityType?: "post" | "battle";
}