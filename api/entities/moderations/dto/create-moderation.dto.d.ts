import { CreateModerationActionInput } from "src/graphql/graphql.schema";
export declare class CreateModerationDto extends CreateModerationActionInput {
    user: string;
    type: string;
}
