import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './ISocket';

interface OnlineUser {
  username: string;
  socketId: string;
}

const onlineUsers: OnlineUser[] = [];

const addUser = (username: string, socketId: string) => {
  // username exists ? update socketId : create new
  const index = onlineUsers.findIndex((user) => user.username === username);
  if (index >= 0) {
    onlineUsers[index].socketId = socketId;
  } else {
    onlineUsers.push({ username, socketId });
  }
};

const removeUser = (socketId: string) => {
  return onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username: string) => {
  return onlineUsers.find((user) => user.username === username);
};

export const initIo = (httpServer: HTTPServer) => {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
    },
  });

  io.on('connection', (socket) => {
    socket.on('addUserCS', (username) => {
      addUser(username, socket.id);
      console.log('addUsers : ', onlineUsers);
    });

    socket.on('createCommentCS', (notification, toUsername) => {
      console.log('comment...');
      const user = getUser(toUsername);
      if (user) {
        io.to(user.socketId).emit('createCommentSC', notification);
      }
    });

    socket.on('likeCommentCS', (notification, toUsername) => {
      console.log('like comment...');
      const user = getUser(toUsername);
      if (user) {
        io.to(user.socketId).emit('likeCommentSC', notification);
      }
    });

    socket.on('likePostCS', (notification, toUsername) => {
      console.log('like...');
      console.log('noti : ', notification);
      console.log('username : ', toUsername);

      const user = getUser(toUsername);
      if (user) {
        console.log('ntf : ', notification);
        io.to(user.socketId).emit('likePostSC', notification);
      }
    });

    socket.on('disconnect', () => {
      const users = removeUser(socket.id);
      console.log('an user left. -- remaining users : ', users);
    });
  });
};
