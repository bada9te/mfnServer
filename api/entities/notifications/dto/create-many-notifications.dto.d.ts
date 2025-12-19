import { Notification } from "../notifications.schema";
export declare class CreateManyNotificationsDto {
    from: string;
    text: string;
    to: string[];
    relatedEntityId: string;
    type: Notification["type"];
    entityType?: "post" | "battle";
}
