const notificationsModel = require('../../models/notifications/notifications.model');

module.exports = {
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
            return await notificationsModel.deleteNotificationsByIds(ids);
        },
        notificationMarkAsReadById: async(_, { _id }) => {
            return await notificationsModel.markNotificationAsRead(_id);
        },
        notificationsMarkAsReadByIds: async(_, { ids }) => {
            return await notificationsModel.markNotificationsAsRead(ids);
        }
    }
}