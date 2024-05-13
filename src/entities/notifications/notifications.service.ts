import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './notifications.schema';
import { Model } from 'mongoose';

@Injectable()
export class NotificationsService {
    constructor(@InjectModel(Notification.name) private notificationsModel: Model<Notification>) {}
    
}
