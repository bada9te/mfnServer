const notificationsModel = require('../../models/notifications/notifications.model');
const usersModel = require('../../models/users/users.model');

// create
const createNotification = async(req, res, next) => {
    const notification = req.body.notification;
    
    try {
        await notificationsModel.createNotification(notification);

        return res.status(201).json({
            done: true,
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
        await notificationsModel.deleteNotificationById(id);
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
        await notificationsModel.deleteNotificationsByIds(ids);
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
        await notificationsModel.markNotificationAsRead(id);
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
        await notificationsModel.markNotificationsAsRead(ids);
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
        const notifications = await notificationsModel.getAllUnreadNotifications(receiverId);
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
        const notifications = await notificationsModel.getAllReadNotifications(receiverId);
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
        const notifications = await notificationsModel.getAllNotificationsByIds(ids);
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