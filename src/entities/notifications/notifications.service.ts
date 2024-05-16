import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './notifications.schema';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto';

@Injectable()
export class NotificationsService {
    constructor(@InjectModel(Notification.name) private notificationsModel: Model<Notification>) {}
    
    async createNotification(notification: CreateNotificationDto) {
        const inserted = await this.notificationsModel.insertMany([notification]);
        return inserted[0];
    }

    async deleteNotificationById(_id: string) {
        return await this.notificationsModel.findByIdAndDelete(_id);
    }

    async deleteNotificationsByIds(ids: string[]) {
        return await this.notificationsModel.deleteMany({ _id: ids });
    }

    async markNotificationAsRead(_id: string) {
        return await this.notificationsModel.findByIdAndUpdate(
            _id,
            { checked: true },
            { new: true, upsert: true }
        );
    }

    async markNotificationsAsRead(ids: string[]) {
        return await this.notificationsModel.updateMany(
            { _id: ids },
            { checked: true },
            { upsert: true }
        );
    }

    async getAllUnreadNotifications(receiverId: string) {
        return await this.notificationsModel.find({
            receiver: receiverId,
            checked: false,
        });
    }

    async getAllReadNotifications(receiverId: string) {
        return await this.notificationsModel.find({
            receiver: receiverId,
            checked: true,
        });
    }

    async getAllNotificationsByIds(ids: string[]) {
        return await this.notificationsModel.find({ _id: ids });
    }
}
