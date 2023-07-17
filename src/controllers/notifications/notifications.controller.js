const notificationsModel = require('../../models/notifications/notifications.model');
const usersModel = require('../../models/users/users.model');

// create
const createNotification = async(req, res) => {
    const notification = req.body.notification;
    notification.createdAt = new Date().toISOString();
    
    try {
        await notificationsModel.createNotification(notification);

        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        return res.status(400).json({
            done: false,
            error: 'Sth went wrong!',
        });
    }
}

// delete
const deleteNotificationById = async(req, res) => {
    const id = req.body.id;
    try {
        await notificationsModel.deleteNotificationById(id)
            .then(async(data) => {
                await usersModel.addOrRemoveNotificationById(data._id, data.receiver)
            });
        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        return res.status(400).json({
            done: false,
            error: 'Sth went wrong!',
        });
    }
}

// mark as read
const markNotificationAsReadById = async(req, res) => {
    const id = req.body.id;
    try {
        await notificationsModel.markNotificationAsRead(id);
        return res.status(201).json({
            done: true,
        });
    } catch (error) {
        return res.status(400).json({
            done: false,
            error: 'Sth went wrong!',
        });
    }
}

// get unread with reciever id
const getAllUnreadNotifications = async(req, res) => {
    const receiverId = req.query.receiverId;

    try {
        const notifications = await notificationsModel.getAllUnreadNotifications(receiverId);
        return res.status(200).json({
            done: true,
            notifications: notifications || [],
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            done: false,
            error: 'Sth went wrong!',
        });
    }
}

// get read with reciever id
const getAllReadNotifications = async(req, res) => {
    const receiverId = req.query.receiverId;

    try {
        const notifications = await notificationsModel.getAllReadNotifications(receiverId);
        return res.status(200).json({
            done: true,
            notifications: notifications || [],
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            done: false,
            error: 'Sth went wrong!',
        });
    }
}

// get all notifications by ids
const getAllNotificationsByIds = async(req, res) => {
    const ids = req.query.ids;
    try {
        const notifications = await notificationsModel.getAllNotificationsByIds(ids);
        return res.status(200).json({
            done: true,
            notifications: notifications || [],
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            done: false,
            error: 'Sth went wrong!',
        });
    }
}


module.exports = {
    createNotification,
    deleteNotificationById,
    markNotificationAsReadById,
    getAllUnreadNotifications,
    getAllReadNotifications,
    getAllNotificationsByIds,
}