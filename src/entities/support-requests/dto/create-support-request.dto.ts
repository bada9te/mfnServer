// @ts-nocheck
import { IsNotEmpty, IsString } from "class-validator";
import { CreateSupportRequestInput } from "../../../graphql/graphql.schema";

export class CreateSupportRequestDto extends CreateSupportRequestInput {
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