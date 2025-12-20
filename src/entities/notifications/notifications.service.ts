import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './notifications.schema';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb'; // import DeleteResult from mongodb
import { CreateManyNotificationsDto, CreateNotificationDto } from './dto';

@Injectable()
export class NotificationsService {
    constructor(@InjectModel(Notification.name) private notificationsModel: Model<Notification>) {}
    
    async createNotification(notification: CreateNotificationDto) {
        const inserted = await this.notificationsModel.create(notification);
        return inserted;
    }

    async deleteNotificationById(_id: string) {
        return this.notificationsModel.findByIdAndDelete(_id);
    }

    async deleteNotificationsByIds(ids: string[]): Promise<DeleteResult> {
        return this.notificationsModel.deleteMany({ _id: ids });
    }

    async markNotificationAsRead(_id: string) {
        return this.notificationsModel.findByIdAndUpdate(
            _id,
            { checked: true },
            { new: true, upsert: true }
        );
    }

    async markNotificationsAsRead(ids: string[]) {
        return this.notificationsModel.updateMany(
            { _id: ids },
            { checked: true },
            { upsert: true }
        );
    }

    async getAllUnreadNotifications(receiverId: string, offset: number, limit: number) {
        return this.notificationsModel.find({
            receiver: receiverId,
            checked: false,
        }).skip(offset).limit(limit);
    }

    async getAllReadNotifications(receiverId: string, offset: number, limit: number) {
        return this.notificationsModel.find({
            receiver: receiverId,
            checked: true,
        }).skip(offset).limit(limit);
    }

    async getAllNotificationsByIds(ids: string[]) {
        return this.notificationsModel.find({ _id: ids });
    }

    async getDocsCount(filter: any) {
        return this.notificationsModel.countDocuments(filter).exec();
    }


    async createManyNotifications({from, to, relatedEntityId, type, entityType}: CreateManyNotificationsDto) {
        const notifications = to.map(i => {
            const data = {
                sender: from,
                receiver: i,
                type,
            }

            if (relatedEntityId && entityType) {
                data[entityType] = relatedEntityId;
            }

            return data;
        });
        return await this.notificationsModel.insertMany(notifications);
    }
}
