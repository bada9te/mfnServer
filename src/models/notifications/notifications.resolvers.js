const { getAllUnreadNotificationsDB, getAllReadNotificationsDB, getAllNotificationsByIdsDB, createNotificationDB, deleteNotificationByIdDB, deleteNotificationsByIdsDB, markNotificationAsReadByIdDB, markNotificationsAsReadByIdsDB } = require("../../db-reslovers/notifications-db-resolver");
const exec = require("../../db-reslovers/execGQL");

module.exports = {
    Query: {
        notificationsUnread: async(_, { receiverId }) => {
            return await exec(() => getAllUnreadNotificationsDB(receiverId));
        },
        notificationsRead: async(_, { receiverId }) => {
            return await exec(() => getAllReadNotificationsDB(receiverId));
        },
        notificationsByIds: async(_, { ids }) => {
            return await exec(() => getAllNotificationsByIdsDB(ids));
        }
    },
    Mutation: {
        notificationCreate: async(_, { input }) => {
            return await exec(() => createNotificationDB(input));
        },
        notificationDeleteById: async(_, { _id }) => {
            return await exec(() => deleteNotificationByIdDB(_id));
        },
        notificationsDeleteByIds: async(_, { ids }) => {
            return await exec(() => deleteNotificationsByIdsDB(_id));
        },
        notificationMarkAsReadById: async(_, { _id }) => {
            return await exec(() => markNotificationAsReadByIdDB(_id));
        },
        notificationsMarkAsReadByIds: async(_, { ids }) => {
            return await exec(() => markNotificationsAsReadByIdsDB(ids));
        }
    }
}