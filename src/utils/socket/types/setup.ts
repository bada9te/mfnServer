import { Socket } from "socket.io";

export interface ICustomSocket extends Socket {
    userId?: string;
}

export type TUser = {
    userId: string;
    socketId: string;
}

export interface IServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    userIdEmit: (a: string, b: string) => void;
    chatEmit: (a: string, b: any) => void;
    chatMessageEmit: (a: string,  b: any) => void;
}
  
export interface IClientToServerEvents {
    hello: () => void;
}

export interface IInterServerEvents {
    ping: () => void;
}

export interface ISocketData {
    userId: string,
}