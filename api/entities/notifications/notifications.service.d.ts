import { Notification } from './notifications.schema';
import { Model } from 'mongoose';
import { CreateManyNotificationsDto, CreateNotificationDto } from './dto';
export declare class NotificationsService {
    private notificationsModel;
    constructor(notificationsModel: Model<Notification>);
    createNotification(notification: CreateNotificationDto): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    deleteNotificationById(_id: string): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    deleteNotificationsByIds(ids: string[]): Promise<import("mongodb").DeleteResult>;
    markNotificationAsRead(_id: string): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }>;
    markNotificationsAsRead(ids: string[]): Promise<import("mongoose").UpdateWriteOpResult>;
    getAllUnreadNotifications(receiverId: string, offset: number, limit: number): Promise<(import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getAllReadNotifications(receiverId: string, offset: number, limit: number): Promise<(import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getAllNotificationsByIds(ids: string[]): Promise<(import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    })[]>;
    getDocsCount(filter: any): Promise<number>;
    createManyNotifications({ from, to, relatedEntityId, type, entityType }: CreateManyNotificationsDto): Promise<import("mongoose").MergeType<import("mongoose").Document<unknown, {}, Notification> & Notification & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v?: number;
    }, Omit<{
        sender: string;
        receiver: string;
        type: "SUBSCRIBED" | "BATTLE_CREATED" | "BATTLE_FINISHED" | "POST_REPORTED" | "POST_CREATED" | "SYSTEM";
    }, "_id">>[]>;
}
