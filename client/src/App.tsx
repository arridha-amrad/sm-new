import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import ProtectedRoute from "./components/ProtectedRoutes";
import {
  selectAuthState,
  setLoginUser,
} from "./features/authentication/authSlice";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import axiosInstance, { setToken } from "./utils/axiosInterceptor";
import { io } from "socket.io-client";
import { getSocket, setSocket } from "./mySocket";
import {
  addNotification,
  setNotifications,
} from "./features/notification/notificationSlice";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import { receiveMessage, setConversations } from "./features/chats/chatSlice";

const App = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { loginUser } = useAppSelector(selectAuthState);

  const socket = getSocket();

  useEffect(() => {
    let isMounted = true;
    const socketIo = io("http://localhost:5000");
    console.log("socketIo : ", socketIo);
    
    setSocket(socketIo);
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/api/auth/refresh-token");
        setToken(res.data.token);
        const { data } = await axiosInstance.get("/api/user/me");
        dispatch(setLoginUser(data.user));
        dispatch(setNotifications(data.notifications));
        dispatch(setConversations(data.conversations))
      } finally {
        isMounted && setIsLoading(false);
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
      socket?.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (loginUser) {
      socket?.emit("addUserCS", loginUser.username);
    }
    socket?.on("createReplySC", (notification) => {
      dispatch(addNotification(notification));
    });
    socket?.on("createCommentSC", (notification) => {
      dispatch(addNotification(notification));
    });
    socket?.on("likePostSC", (notification) => {
      dispatch(addNotification(notification));
    });
    socket?.on("likeCommentSC", (notification) => {
      dispatch(addNotification(notification));
    });
    socket?.on("likeReplySC", (notification) => {
      dispatch(addNotification(notification));
    });

    socket?.on("sendMessageSC", (conversation, message) => {
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
    </Routes>
  );
};

export default App;
