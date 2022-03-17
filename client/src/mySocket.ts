import { Socket } from "socket.io-client";

let socket: Socket | null;

export const getSocket = () => socket;
export const setSocket = (newSocket: Socket) => {
  socket = newSocket;
};
