import { CreateSupportRequestInput } from "src/graphql/graphql.schema";
export declare class CreateSupportRequestDto extends CreateSupportRequestInput {
    contactReason: string;
    email: string;
    message: string;
}
