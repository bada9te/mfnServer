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


        /***************** CHATS HANDLERS *****************/
        // create
        socket.on('message create', ({ message, toUsers }) => {
            console.log(message, toUsers)
            const users = getCurrentUsers(io).filter(i => toUsers.includes(i.userId));
            socket.to(users.map(i => i.socketId)).emit('message create', {
                message,
            });
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