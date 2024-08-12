import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    relatedEntityId: string;

    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @IsString()
    taskType: "FINISH_BATTLE" | "unknown";
}