// socket.service.ts
import { Injectable } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TUser, ISocketData, ICustomSocket, TSocketUserBody, TSocketChatBody } from './types';
import { TSocketMessageBody } from './types/messageType';

@Injectable()
@WebSocketGateway()
export class SocketService implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        console.log('[SOCKET] [*] Initialized.');
    }

    handleConnection(client: ICustomSocket) {
        console.log(`[SOCKET] [+] User is connected, ${JSON.stringify({ SID: client.id, UID: client.userId }, null)}`);
        const users = this.getCurrentUsers();
        client.emit('users', users);
        client.broadcast.emit('user connected', {
            socketId: client.id,
            userId: client.userId,
        });
    }

    handleDisconnect(client: ICustomSocket) {
        client.broadcast.emit('user disconnected', {
            socketId: client.id,
            userId: client.userId,
        });
        console.log(`[SOCKET] [-] User disconnected, ${JSON.stringify({ SID: client.id, UID: client.userId }, null)}`);
    }

    getCurrentUsers(): TUser[] {
        const users: TUser[] = [];
        for (const [id, socket] of this.server.of('/').sockets) {
            const customSock = socket as any; // Adjust according to your types
            users.push({
                socketId: id,
                userId: customSock.userId,
            });
        }
        return users;
    }

    getUsersByToUsersArray(toUsers: string[]): string[] {
        return this.getCurrentUsers().filter((user) => toUsers.includes(user.userId)).map((user) => user.socketId);
    }

    /***************** USERS HANDLERS *****************/
    @SubscribeMessage('user subscribed')
    handleUserSubscribed(@MessageBody() data: TSocketUserBody, @ConnectedSocket() client: Socket): void {
        const { userId, toUsers } = data;
        client.to(this.getUsersByToUsersArray(toUsers)).emit('userIdEmit', 'user subscribed', userId);
    }

    @SubscribeMessage('user unsubscribed')
    handleUserUnsubscribed(@MessageBody() data: TSocketUserBody, @ConnectedSocket() client: Socket): void {
        const { userId, toUsers } = data;
        client.to(this.getUsersByToUsersArray(toUsers)).emit('userIdEmit', 'user unsubscribed', userId);
    }

    /***************** CHATS HANDLERS *****************/
    @SubscribeMessage('chat create')
    handleChatCreate(@MessageBody() data: TSocketChatBody, @ConnectedSocket() client: Socket): void {
        const { chat, toUsers } = data;
        client.to(this.getUsersByToUsersArray(toUsers)).emit("chatEmit", 'chat create', chat);
    }

    @SubscribeMessage('chat update')
    handleChatUpdate(@MessageBody() data: TSocketChatBody, @ConnectedSocket() client: Socket): void {
        const { chat, toUsers } = data;
        client.to(this.getUsersByToUsersArray(toUsers)).emit("chatEmit", 'chat update', chat);
    }

    @SubscribeMessage('chat delete')
    handleChatDelete(@MessageBody() data: TSocketChatBody, @ConnectedSocket() client: Socket): void {
        const { chat, toUsers } = data;
        client.to(this.getUsersByToUsersArray(toUsers)).emit("chatEmit", 'chat delete', chat);
    }

    /**************** C-MSGS HANDLERS *****************/
    @SubscribeMessage('message create')
    handleMessageCreate(@MessageBody() data: TSocketMessageBody, @ConnectedSocket() client: Socket): void {
        const { message, toUsers } = data;
        client.to(this.getUsersByToUsersArray(toUsers)).emit("chatMessageEmit", 'message create', message);
    }

    @SubscribeMessage('message read')
    handleMessageRead(@MessageBody() data: TSocketMessageBody, @ConnectedSocket() client: Socket): void {
        const { message, toUsers } = data;
        client.to(this.getUsersByToUsersArray(toUsers)).emit("chatMessageEmit", 'message read', message);
    }

    @SubscribeMessage('message update')
    handleMessageUpdate(@MessageBody() data: TSocketMessageBody, @ConnectedSocket() client: Socket): void {
        const { message, toUsers } = data;
        client.to(this.getUsersByToUsersArray(toUsers)).emit("chatMessageEmit", 'messsage update', message);
    }

    @SubscribeMessage('message delete')
    handleMessageDelele(@MessageBody() data: TSocketMessageBody, @ConnectedSocket() client: Socket): void {
        const { message, toUsers } = data;
        client.to(this.getUsersByToUsersArray(toUsers)).emit("chatMessageEmit", 'messsage delete', message);
    }
}
