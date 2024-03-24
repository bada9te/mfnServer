import * as notificationsModel from '../../models/notifications/notifications.model';

export default {
    Query: {
        notifications: async(_, { receiverId, checked }) => {
            if (checked) {
                return await notificationsModel.getAllReadNotifications(receiverId);
            } else {
                return await notificationsModel.getAllUnreadNotifications(receiverId);
            }
        },
        notificationsByIds: async(_, { ids }) => {
            return await notificationsModel.getAllNotificationsByIds(ids);
        }
    },
    Mutation: {
        notificationCreate: async(_, { input }) => {
            let createdNotification;
            await notificationsModel.createNotification(input).then(data => {
                createdNotification = data[0];
            });
            return createdNotification;
        },
        notificationDeleteById: async(_, { _id }) => {
            return await notificationsModel.deleteNotificationById(_id);
        },
        notificationsDeleteByIds: async(_, { ids }) => {
            const data = await notificationsModel.deleteNotificationsByIds(ids)
            return { count: data.deletedCount };
        },
        notificationMarkAsReadById: async(_, { _id }) => {
            return await notificationsModel.markNotificationAsRead(_id);
        },
        notificationsMarkAsReadByIds: async(_, { ids }) => {
            const data = await notificationsModel.markNotificationsAsRead(ids)
            return { count: data.modifiedCount };
        }
    }
}