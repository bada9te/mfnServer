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

const getAllNotificationsDB = async(receiverId, checked) => {
    if (checked) {
        return await notificationsModel.getAllReadNotifications(receiverId);
    } else {
        return await notificationsModel.getAllUnreadNotifications(receiverId);
    }
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
    getAllNotificationsDB,
    getAllNotificationsByIdsDB,
}