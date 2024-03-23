import { Server } from 'socket.io';
//import notificationsModel from '../../models/notifications/notifications.model';
//import usersModel from '../../models/users/users.model';
import config from '../../config';
import http from "http";
import { IClientToServerEvents, ICustomSocket, IInterServerEvents, IServerToClientEvents, ISocketData, TUser } from './types';

// get current connections 
const getCurrentUsers = (io: Server<IClientToServerEvents, IServerToClientEvents, IInterServerEvents, ISocketData>) => {
    const users: TUser[] = [];
    for (let [id, socket] of io.of("/").sockets) {
        const customSock = socket as ICustomSocket;
        users.push({
            socketId: id,
            userId: customSock.userId,
        });
    }
    return users;
}

// get users includes in [toUsers]
const getUsersByToUsersArray = (io: Server<IClientToServerEvents, IServerToClientEvents, IInterServerEvents, ISocketData>, toUsers: string[]) => {
    return getCurrentUsers(io).filter(i => toUsers.includes(i.userId)).map(i => i.socketId);
}

// socket.io
const initSocketIO = async(SERVER: http.Server) => {
    console.log(`[SOCKET] [*] Initializing...`);
    const io = new Server<IClientToServerEvents, IServerToClientEvents, IInterServerEvents, ISocketData>(SERVER, { cors: { origin: config.base.clientBase } });

    // main
    io.on("connection", (socket: ICustomSocket) => {
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
            io.to(getUsersByToUsersArray(io, toUsers)).emit("userIdEmit", "user subscribed", userId);
        });

        // subscribe
        socket.on('user unsubscribed', ({ userId, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit("userIdEmit", 'user unsubscribed', userId);
        });

        /***************** CHATS HANDLERS *****************/
        // create chat
        socket.on('chat create', ({ chat, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit("chatEmit", 'chat create', chat);
        });

        // update chat
        socket.on('chat update', ({ chat, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit("chatEmit", 'chat update', chat);
        });

        // delete chat
        socket.on('chat delete', ({ chat, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit("chatEmit", 'chat delete', chat);
        });

        /**************** C-MSGS HANDLERS *****************/
        // create msg
        socket.on('message create', ({ message, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit("chatMessageEmit", 'message create', message);
        });

        // read msg
        socket.on('message read', ({ message, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit("chatMessageEmit", 'message read', message);
        });

        // update msg
        socket.on('message update', ({ message, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit("chatMessageEmit", 'messsage update', message);
        });

        // delete msg
        socket.on('message delete', ({ message, toUsers }) => {
            io.to(getUsersByToUsersArray(io, toUsers)).emit("chatMessageEmit", 'messsage delete', message);
        });
    });

    // middleware to check for userId
    io.use((socket: ICustomSocket, next) => {
        const userId = socket.handshake.auth.userId;
        if (!userId) {
            return next(new Error("Invalid user id"));
        }
        socket.userId = userId;
        next();
    });
    console.log(`[SOCKET] [*] Initialized.`);
}


export default initSocketIO;