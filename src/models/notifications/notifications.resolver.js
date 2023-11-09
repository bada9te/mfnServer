const { GraphQLError } = require("graphql");
const { getAllUnreadNotificationsDB, getAllReadNotificationsDB, getAllNotificationsByIdsDB, createNotificationDB, deleteNotificationByIdDB, deleteNotificationsByIdsDB, markNotificationAsReadByIdDB, markNotificationsAsReadByIdsDB } = require("../../db-reslovers/notifications-db-resolver");

module.exports = {
    Query: {
        getAllUnreadNotifications: async(_, { receiverId }) => {
            try {
                return await getAllUnreadNotificationsDB(receiverId);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
        getAllReadNotifications: async(_, { receiverId }) => {
            try {
                return await getAllReadNotificationsDB(receiverId);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
        getAllNotificationsByIds: async(_, { ids }) => {
            try {
                return await getAllNotificationsByIdsDB(ids);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        }
    },
    Mutation: {
        createNotification: async(_, { input }) => {
            try {
                return await createNotificationDB(input);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
        deleteNotificationById: async(_, { _id }) => {
            try {
                return await deleteNotificationByIdDB(_id);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
        deleteNotificationsByIds: async(_, { ids }) => {
            try {
                return await deleteNotificationsByIdsDB(_id);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
        markNotificationAsReadById: async(_, { _id }) => {
            try {
                return await markNotificationAsReadByIdDB(_id);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        },
        markNotificationsAsReadByIds: async(_, { ids }) => {
            try {
                return await markNotificationsAsReadByIdsDB(ids);
            } catch (error) {
                throw new GraphQLError(error.msg);
            }
        }
    }
}