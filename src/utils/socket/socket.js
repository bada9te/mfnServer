const { Server } = require('socket.io');
const notificationsModel = require('../../models/notifications/notifications.model');
const usersModel = require('../../models/users/users.model');
const config = require('../../config');

// get current connections 
const getCurrentUsers = (io) => {
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            socketId: id,
            userId: socket.userId,
        });
    }
    return users;
}

// get users includes in [toUsers]
const getUsersByToUsersArray = (io, toUsers) => {
    return getCurrentUsers(io).filter(i => toUsers.includes(i.userId)).map(i => i.socketId);
}

// socket.io
const initSocketIO = async(SERVER) => {
    console.log(`[SOCKET] [*] Initializing...`);
    const io = new Server(SERVER, { cors: { origin: config.base.clientBase } });

    // main
    io.on("connection", (socket) => {
        console.log(`[SOCKET] [+] User is connected, ${JSON.stringify({ SID: socket.id, UID: socket.userId }, null)}`);
        const users = getCurrentUsers(io);
        socket.emit('users', users);
        socket.broadcast.emit("user connected", {
            socketId: socket.id,
            userId: socket.userId,
        });

        socket.on('disconnect', () => {
            socket.broadcast.emit("user disconnected", {
                socketId: socket.id, 
                userId: socket.userId,
            });
            console.log(`[SOCKET] [-] User disconnected, ${JSON.stringify({ SID: socket.id, UID: socket.userId }, null)}`);
        });

        /***************** USERS HANDLERS *****************/
        // subscribe
        socket.on('user subscribed', ({ userId, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit('user subscribed', userId);
        });

        // subscribe
        socket.on('user unsubscribed', ({ userId, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit('user unsubscribed', userId);
        });

        /***************** CHATS HANDLERS *****************/
        // create chat
        socket.on('chat create', ({ chat, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit('chat create', chat);
        });

        // update chat
        socket.on('chat update', ({ chat, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit('chat update', chat);
        });

        // delete chat
        socket.on('chat delete', ({ chat, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit('chat delete', chat);
        });

        /**************** C-MSGS HANDLERS *****************/
        // create msg
        socket.on('message create', ({ message, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit('message create', message);
        });

        // read msg
        socket.on('message read', ({ message, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit('message read', message);
        });

        // update msg
        socket.on('message update', ({ message, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit('messsage update', message);
        });

        // delete msg
        socket.on('message delete', ({ message, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit('messsage delete', message);
        });
    });

    // middleware to check for userId
    io.use((socket, next) => {
        const userId = socket.handshake.auth.userId;
        if (!userId) {
            return next(new Error("Invalid user id"));
        }
        socket.userId = userId;
        next();
    });
    console.log(`[SOCKET] [*] Initialized.`);
}


module.exports = initSocketIO;