const notificationsModel = require('../models/notifications/notifications.model');


const createNotificationDB = async(notification) => {
    let createdNotification;
    await notificationsModel.createNotification(notification).then(data => {
        createdNotification = data[0];
    });
    return createdNotification;
}

const deleteNotificationByIdDB = async(id) => {
    return await notificationsModel.deleteNotificationById(id);
}

const deleteNotificationsByIdsDB = async(ids) => {
    return await notificationsModel.deleteNotificationsByIds(ids);
}

const markNotificationAsReadByIdDB = async(id) => {
    return await notificationsModel.markNotificationAsRead(id);
}

const markNotificationsAsReadByIdsDB = async(ids) => {
    return await notificationsModel.markNotificationsAsRead(ids);
}

const getAllUnreadNotificationsDB = async(receiverId) => {
    return await notificationsModel.getAllUnreadNotifications(receiverId);
}

const getAllReadNotificationsDB = async(receiverId) => {
    return await notificationsModel.getAllReadNotifications(receiverId);
}

const getAllNotificationsByIdsDB = async(ids) => {
    return await notificationsModel.getAllNotificationsByIds(ids);
}

module.exports = {
    createNotificationDB,
    deleteNotificationByIdDB,
    deleteNotificationsByIdsDB,
    markNotificationAsReadByIdDB,
    markNotificationsAsReadByIdsDB,
    getAllUnreadNotificationsDB,
    getAllReadNotificationsDB,
    getAllNotificationsByIdsDB,
}