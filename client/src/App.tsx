import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import useCheckAuth from "./hooks/useCheckAuth";
import MySpinner from "./components/MySpinner";
import PostDetail from "./pages/PostDetail";
import useSocket from "./hooks/useSocket";

const App = () => {
  const { loading } = useCheckAuth();
  useSocket();

  if (loading) {
    return <MySpinner />;
  }

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/post/detail" element={<PostDetail />} />
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
