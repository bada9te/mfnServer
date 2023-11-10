const { getAllUnreadNotificationsDB, getAllReadNotificationsDB, getAllNotificationsByIdsDB, createNotificationDB, deleteNotificationByIdDB, deleteNotificationsByIdsDB, markNotificationAsReadByIdDB, markNotificationsAsReadByIdsDB } = require("../../db-reslovers/notifications-db-resolver");
const exec = require("../../db-reslovers/execGQL");

module.exports = {
    Query: {
        getAllUnreadNotifications: async(_, { receiverId }) => {
            return await exec(() => getAllUnreadNotificationsDB(receiverId));
        },
        getAllReadNotifications: async(_, { receiverId }) => {
            return await exec(() => getAllReadNotificationsDB(receiverId));
        },
        getAllNotificationsByIds: async(_, { ids }) => {
            return await exec(() => getAllNotificationsByIdsDB(ids));
        }
    },
    Mutation: {
        createNotification: async(_, { input }) => {
            return await exec(() => createNotificationDB(input));
        },
        deleteNotificationById: async(_, { _id }) => {
            return await exec(() =>deleteNotificationByIdDB(_id));
        },
        deleteNotificationsByIds: async(_, { ids }) => {
            return await exec(() =>deleteNotificationsByIdsDB(_id));
        },
        markNotificationAsReadById: async(_, { _id }) => {
            return await exec(() =>markNotificationAsReadByIdDB(_id));
        },
        markNotificationsAsReadByIds: async(_, { ids }) => {
            return await exec(() =>markNotificationsAsReadByIdsDB(ids));
        }
    }
}