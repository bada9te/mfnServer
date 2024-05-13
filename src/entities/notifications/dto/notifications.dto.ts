import { IsNotEmpty, IsString } from "class-validator"

export class NotificationCreationDto {
    @IsNotEmpty()
    @IsString()
    receiver: string;

    @IsNotEmpty()
    @IsString()
    sender: string;

    @IsString()
    post?: string;

    @IsString()
    comment?: string;
    
    @IsString()
    text?: string;
}