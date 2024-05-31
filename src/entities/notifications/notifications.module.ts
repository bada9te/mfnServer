import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notifications.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Notification.name,
        useFactory: () => {
          const schema = NotificationSchema;
          schema.plugin(require("mongoose-autopopulate"));
          return schema;
        }
      }
    ])
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
