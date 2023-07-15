const { Server } = require('socket.io');
const notificationsModel = require('../models/notifications/notifications.model');
const usersModel = require('../models/users/users.model');

// socket.io
const initSocketIO = (SERVER) => {
    const io = new Server(SERVER, { /* options */ });
    io.on("connection", (socket) => {
        console.log(`[SOCKET] User is connected, socketID: ${socket.id}`);
        
        // like was added
        socket.on("post-add-like", async(data) => {
            await notificationsModel.createNotification({
                receiver: data.receiver,
                sender: data.sender,
                text: data.text,
                createdAt: new Date().toISOString(),
            }).then(async(notification) => {
                await usersModel.addOrRemoveNotificationById(notification[0]._id, notification[0].receiver)
                .then(() => {
                    notification[0].post = data.post;
                    socket.broadcast.emit(`post-${data.post}-was-liked`, notification[0]);
                    socket.broadcast.emit(`user-${data.receiver}-post-was-liked`, notification[0]);
                });
            });
        });
        // like was removed
        socket.on("post-remove-like", (data) => {
            socket.broadcast.emit(`post-${data.postId}-was-unliked`, data);
        });
    

        // comment was added
        socket.on("post-add-comment", (data) => {
            socket.broadcast.emit(`post-${data.postId}-was-commented`, data);
        });
        // comment was removed
        socket.on("post-remove-comment", (data) => {
            socket.broadcast.emit(`post-${data.postId}-was-uncommented`, data);
        });


        // post was saved
        socket.on("post-add-save", async(data) => {
            await notificationsModel.createNotification({
                receiver: data.receiver,
                sender: data.sender,
                text: data.text,
                createdAt: new Date().toISOString(),
            }).then(async(notification) => {
                await usersModel.addOrRemoveNotificationById(notification[0]._id, notification[0].receiver)
                .then(() => {
                    notification[0].post = data.post;
                    socket.broadcast.emit(`post-${data.post}-was-saved`, data);
                    socket.broadcast.emit(`user-${data.receiver}-post-was-saved`, notification[0]);
                });
            });
        });
        // post was unsaved
        socket.on("post-remove-save", (data) => {
            socket.broadcast.emit(`post-${data.postId}-was-unsaved`, data);
        });


        // user was subscribed
        socket.on("user-was-subscribed", async(data) => {
            await notificationsModel.createNotification({
                receiver: data.receiver,
                sender: data.sender,
                text: data.text,
                createdAt: new Date().toISOString(),
            }).then(async(notification) => {
                await usersModel.addOrRemoveNotificationById(notification[0]._id, notification[0].receiver)
                .then(() => {
                    socket.broadcast.emit(`subscribed-on-${data.receiver}`, notification[0]);
                });
            });
        });

        // share post (track)
        socket.on("post-share", async(data) => {
            await notificationsModel.createNotification({
                receiver: data.receiver,
                sender: data.sender,
                text: data.text,
                createdAt: new Date().toISOString(),
            }).then(async(notification) => {
                await usersModel.addOrRemoveNotificationById(notification[0]._id, notification[0].receiver)
                .then(() => {
                    notification[0].post = data.post;
                    socket.broadcast.emit(`post-shared-to-${data.receiver}`, notification[0]);
                });
            });
        });

    });
}

module.exports = initSocketIO;