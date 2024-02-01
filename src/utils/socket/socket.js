const { Server } = require('socket.io');
const notificationsModel = require('../../models/notifications/notifications.model');
const usersModel = require('../../models/users/users.model');
const config = require('../../config');

// socket.io
const initSocketIO = async(SERVER) => {
    console.log(`[SOCKET] Initializing...`);
    const io = new Server(SERVER, { cors: { origin: config.base.clientBase } });
    io.on("connection", (socket) => {
        const users = [];
        for (let [id, socket] of io.of("/").sockets) {
            users.push({
                socketId: id,
                userId: socket.userId
            });
        }
        socket.emit("users", users);
        console.log(`[SOCKET] User is connected, socketID: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`[SOCKET] User disconnected, socketID: ${socket.id}`);
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
    console.log(`[SOCKET] Initialized.`);
}


module.exports = initSocketIO;