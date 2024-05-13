import { IsNotEmpty, IsNumber } from "class-validator";

export class RangeDto {
    @IsNumber()
    @IsNotEmpty()
    offset: number;

    @IsNumber()
    @IsNotEmpty()
    limit: number;
}