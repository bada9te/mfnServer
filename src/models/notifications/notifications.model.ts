import Notification from './notifications.mongo';
import { TNewNotification } from './types';

// create notification
const createNotification = async(notification: TNewNotification) => {
    return await Notification.insertMany([notification])
}

// delete notification
const deleteNotificationById = async(id: string) => {
    return await Notification.findByIdAndDelete(id)
}

// delete notification
const deleteNotificationsByIds = async(ids: string[]) => {
    return await Notification.deleteMany({ _id: ids })
}

// mark as read
const markNotificationAsRead = async(id: string) => {
    return await Notification.findOneAndUpdate({ 
        _id: id,
    }, {
        checked: true,
    }, {
        new: true,
        upsert: true,
    })
}

// mark as read
const markNotificationsAsRead = async(ids: string[]) => {
    return await Notification.updateMany({ 
        _id: ids,
    }, {
        checked: true,
    }, {
        upsert: true,
    })
}

// get with receiver id
const getAllUnreadNotifications = async(id: string) => {
    return await Notification.find({ 
        receiver: id,
        checked: false,
    })
}

// get with receiver id
const getAllReadNotifications = async(id: string) => {
    return await Notification.find({ 
        receiver: id,
        checked: true,
    })
}

// get with ids
const getAllNotificationsByIds = async(ids: string[]) => {
    return await Notification.find({ _id: ids })
}



export {
    createNotification,
    deleteNotificationById,
    deleteNotificationsByIds,
    markNotificationAsRead,
    markNotificationsAsRead,
    getAllUnreadNotifications,
    getAllReadNotifications,
    getAllNotificationsByIds,
}
