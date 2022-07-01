import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import configVariables from '../config';
import { selectAuthState } from '../features/authentication/authSlice';
import { receiveMessage } from '../features/chats/chatSlice';
import { addNotification } from '../features/notification/notificationSlice';
import { getSocket, setSocket } from '../socket/mySocket';

export const initSocket = () => {
  return io(configVariables.serverOrigin);
};

const useSocket = () => {
  const socket = getSocket();
  const { loginUser } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = initSocket();
    setSocket(socket);
    return () => {
      socket?.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket?.on('createReplySC', (notification) => {
      dispatch(addNotification(notification));
    });
    socket?.on('createCommentSC', (notification) => {
      dispatch(addNotification(notification));
    });
    socket?.on('likePostSC', (notification) => {
      dispatch(addNotification(notification));
    });
    socket?.on('likeCommentSC', (notification) => {
      dispatch(addNotification(notification));
    });
    socket?.on('likeReplySC', (notification) => {
      dispatch(addNotification(notification));
    });

    socket?.on('sendMessageSC', ({ conversation, message }) => {
      dispatch(
        receiveMessage({
          conversation,
          message,
        })
      );
    });
    // eslint-disable-next-line
  }, [socket]);

  useEffect(() => {
    if (loginUser) {
      socket?.emit('addUserCS', loginUser.username);
    }
  }, [loginUser, socket]);
};

export default useSocket;
