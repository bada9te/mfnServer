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
            if (data.selfAction) {
                console.log('SELF_ACTION_ADD_LIKE');
                socket.broadcast.emit(`post-${data.post}-was-liked`, data);
            } else {
                await notificationsModel.createNotification({
                    receiver: data.receiver,
                    sender: data.sender,
                    text: data.text,
                    post: data.post,
                }).then(async(notification) => {
                    notification[0].post = data.post;
                    socket.broadcast.emit(`post-${data.post}-was-liked`, notification[0]);
                    socket.broadcast.emit(`user-${data.receiver}-post-was-liked`, notification[0]);
                });
            }
        });
        // like was removed
        socket.on("post-remove-like", (data) => {
            socket.broadcast.emit(`post-${data.post}-was-unliked`, data);
        });
    

        // comment was added
        socket.on("post-add-comment", async(data) => {
            if (data.selfAction) {
                console.log('SELF_ACTION_ADD_COMMENT');
                socket.broadcast.emit(`post-${data.postId}-was-commented`, data);
            } else {
                await notificationsModel.createNotification({
                    receiver: data.receiver,
                    sender: data.sender,
                    text: data.text,
                    comment: data.comment,
                    post: data.post,
                }).then(() => {
                    socket.broadcast.emit(`post-${data.postId}-was-commented`, data);
                });
            }
        });
        // comment was removed
        socket.on("post-remove-comment", (data) => {
            socket.broadcast.emit(`post-${data.postId}-was-uncommented`, data);
        });


        // post was saved
        socket.on("post-add-save", async(data) => {
            if (data.selfAction) {
                console.log('SELF_ACTION_ADD_SAVE');
                socket.broadcast.emit(`post-${data.post}-was-saved`, data);
            } else {
                await notificationsModel.createNotification({
                    receiver: data.receiver,
                    sender: data.sender,
                    text: data.text,
                    post: data.post,
                }).then(async(notification) => {
                    notification[0].post = data.post;
                    socket.broadcast.emit(`post-${data.post}-was-saved`, data);
                    socket.broadcast.emit(`user-${data.receiver}-post-was-saved`, notification[0]);
                });
            }
        });
        // post was unsaved
        socket.on("post-remove-save", (data) => {
            socket.broadcast.emit(`post-${data.post}-was-unsaved`, data);
        });


        // user was subscribed
        socket.on("user-was-subscribed", async(data) => {
            await notificationsModel.createNotification({
                receiver: data.receiver,
                sender: data.sender,
                text: data.text,
            }).then(async(notification) => {
                socket.broadcast.emit(`subscribed-on-${data.receiver}`, notification[0]);
            });
        });

        // share post (track)
        socket.on("post-share", async(data) => {
            await notificationsModel.createNotification({
                receiver: data.receiver,
                sender: data.sender,
                text: data.text,
                post: data.post,
            }).then(async(notification) => {
                notification[0].post = data.post;
                socket.broadcast.emit(`post-shared-to-${data.receiver}`, notification[0]);
            });
        });

        // battle add vote
        socket.on("battle-add-vote", async(data) => {
            socket.broadcast.emit(`battle-${data.battleId}-voted`, data);
        });
    });
}


module.exports = initSocketIO;