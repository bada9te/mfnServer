import { IsNotEmpty, IsString } from "class-validator";

export class SupportRequstCreationDto {
    @IsNotEmpty()
    @IsString()
    contactReason: string;

    @IsNotEmpty()
    @IsString()
    email: string;
    
    @IsNotEmpty()
    @IsString()
    message: string;
}