const Notification = require('./notifications.mongo');

// create notification
const createNotification = async(notification) => {
    return await Notification.insertMany([notification])
    .catch((err) => {
        throw new Error(err);
    });
}

// delete notification
const deleteNotificationById = async(id) => {
    return await Notification.findByIdAndDelete(id)
    .catch((err) => {
        throw new Error(err);
    });
}

// delete notification
const deleteNotificationsByIds = async(ids) => {
    return await Notification.deleteMany({ _id: ids })
    .catch((err) => {
        throw new Error(err);
    });
}

// mark as read
const markNotificationAsRead = async(id) => {
    return await Notification.findOneAndUpdate({ 
        _id: id,
    }, {
        checked: true,
    }, {
        new: true,
        upsert: true,
    })
    .catch((err) => {
        throw new Error(err);
    });
}

// mark as read
const markNotificationsAsRead = async(ids) => {
    return await Notification.updateMany({ 
        _id: ids,
    }, {
        checked: true,
    }, {
        upsert: true,
    })
    .catch((err) => {
        throw new Error(err);
    });
}

// get with receiver id
const getAllUnreadNotifications = async(id) => {
    return await Notification.find({ 
        receiver: id,
        checked: false,
    })
    .catch((err) => {
        throw new Error(err);
    });
}

// get with receiver id
const getAllReadNotifications = async(id) => {
    return await Notification.find({ 
        receiver: id,
        checked: true,
    })
    .catch((err) => {
        throw new Error(err);
    });
}

// get with ids
const getAllNotificationsByIds = async(ids) => {
    return await Notification.find({ _id: ids })
    .catch((err) => {
        throw new Error(err);
    });
}



module.exports = {
    createNotification,
    deleteNotificationById,
    deleteNotificationsByIds,
    markNotificationAsRead,
    markNotificationsAsRead,
    getAllUnreadNotifications,
    getAllReadNotifications,
    getAllNotificationsByIds,
}
