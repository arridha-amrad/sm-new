import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import ProtectedRoute from './components/ProtectedRoutes';
import {
  selectAuthState,
  setLoginUser,
} from './features/authentication/authSlice';
import Home from './pages/HomePage';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import axiosInstance from './utils/axiosInterceptor';
import { io } from 'socket.io-client';
import { getSocket, setSocket } from './mySocket';
import {
  addNotification,
  setNotifications,
} from './features/notification/notificationSlice';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import { receiveMessage, setConversations } from './features/chats/chatSlice';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import configVariables from './config';

const App = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { loginUser } = useAppSelector(selectAuthState);

  const socket = getSocket();

  const fetchUser = async (signal: AbortSignal) => {
    try {
      const { data } = await axiosInstance.get('/api/user/me', {
        signal,
      });
      dispatch(setLoginUser(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const socketIo = io(configVariables.serverOrigin);
    setSocket(socketIo);
    const controller = new AbortController();
    fetchUser(controller.signal);
    return () => {
      controller.abort();
      socket?.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (loginUser) {
      socket?.emit('addUserCS', loginUser.username);
    }
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

    socket?.on('sendMessageSC', (conversation, message) => {
      dispatch(
        receiveMessage({
          conversation,
          message,
        })
      );
    });
    // eslint-disable-next-line
  }, [socket]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <p>loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<ChatPage />} />
      </Route>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    </Routes>
  );
};

export default App;
