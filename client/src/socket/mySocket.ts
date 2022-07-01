import { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from './ISocket';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;

export const getSocket = () => socket;
export const setSocket = (newSocket: Socket) => (socket = newSocket);
