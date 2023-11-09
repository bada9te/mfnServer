const { createNotificationDB, deleteNotificationByIdDB, deleteNotificationsByIdsDB, markNotificationAsReadByIdDB, markNotificationsAsReadByIdsDB, getAllUnreadNotificationsDB, getAllReadNotificationsDB, getAllNotificationsByIdsDB } = require('../db-reslovers/notifications-db-resolver');
const notificationsModel = require('../models/notifications/notifications.model');


// create
const createNotification = async(req, res, next) => {
    const notification = req.body.notification;
    
    try {
        const createdNotification = await createNotificationDB(notification)

        return res.status(201).json({
            done: true,
            notification: createdNotification,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// delete
const deleteNotificationById = async(req, res, next) => {
    const id = req.body.id;
    try {
        await deleteNotificationByIdDB(id);
        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// delete many
const deleteNotificationsByIds = async(req, res, next) => {
    const ids = req.body.ids;
    try {
        await deleteNotificationsByIdsDB(ids);
        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


// mark as read
const markNotificationAsReadById = async(req, res, next) => {
    const id = req.body.id;
    try {
        await markNotificationAsReadByIdDB(id);
        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// mark many as read
const markNotificationsAsReadByIds = async(req, res, next) => {
    const ids = req.body.ids;
    try {
        await markNotificationsAsReadByIdsDB(ids);
        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// get unread with reciever id
const getAllUnreadNotifications = async(req, res, next) => {
    const receiverId = req.query.receiverId;

    try {
        const notifications = await getAllUnreadNotificationsDB(receiverId);
        return res.status(200).json({
            done: true,
            notifications: notifications || [],
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// get read with reciever id
const getAllReadNotifications = async(req, res, next) => {
    const receiverId = req.query.receiverId;

    try {
        const notifications = getAllReadNotificationsDB(receiverId);
        return res.status(200).json({
            done: true,
            notifications: notifications || [],
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}

// get all notifications by ids
const getAllNotificationsByIds = async(req, res, next) => {
    const ids = req.query.ids;
    try {
        const notifications = getAllNotificationsByIdsDB(ids);
        return res.status(200).json({
            done: true,
            notifications: notifications || [],
        });
    } catch (error) {
        error.status = 400;
        return next(error);
    }
}


module.exports = {
    createNotification,
    deleteNotificationById,
    deleteNotificationsByIds,
    markNotificationAsReadById,
    markNotificationsAsReadByIds,
    getAllUnreadNotifications,
    getAllReadNotifications,
    getAllNotificationsByIds,
}