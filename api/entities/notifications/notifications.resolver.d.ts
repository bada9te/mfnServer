import { NotificationsService } from "./notifications.service";
import { CreateNotificationDto } from "./dto";
export declare class NotificationsResolver {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    notifications(receiverId: string, checked: boolean, offset: number, limit: number): Promise<{
        notifications: (import("mongoose").Document<unknown, {}, import("./notifications.schema").Notification> & import("./notifications.schema").Notification & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v?: number;
        })[];
        count: number;
    }>;
    notificationsByIds(ids: string[]): Promise<(import("mongoose").Document<unknown, {}, import("./notifications.schema").Notification> & import("./notifications.schema").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    notificationCreate(dto: CreateNotificationDto): Promise<import("mongoose").Document<unknown, {}, import("./notifications.schema").Notification> & import("./notifications.schema").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    notificationDeleteById(_id: string): Promise<import("mongoose").Document<unknown, {}, import("./notifications.schema").Notification> & import("./notifications.schema").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    notificationsDeleteByIds(ids: string[]): Promise<{
        count: number;
    }>;
    notificationMarkAsReadById(_id: string): Promise<import("mongoose").Document<unknown, {}, import("./notifications.schema").Notification> & import("./notifications.schema").Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    notificationsMarkAsReadByIds(ids: string[]): Promise<{
        count: number;
    }>;
}
