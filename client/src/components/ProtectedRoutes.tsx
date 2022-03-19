import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/authentication/authSlice";
import AppBar from "./AppBar";

const ProtectedRoute = () => {
  const { loginUser, isLoadingAuth } = useAppSelector(selectUserState);

  return !isLoadingAuth && loginUser ? (
    <>
      <AppBar />
      <div className="mt-5" />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
