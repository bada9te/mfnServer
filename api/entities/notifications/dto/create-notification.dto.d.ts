import { CreateNotificationInput } from "src/graphql/graphql.schema";
export declare class CreateNotificationDto extends CreateNotificationInput {
    receiver: string;
    sender?: string;
    post?: string;
    battle?: string;
    text: string;
}
