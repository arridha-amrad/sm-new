import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectUserState } from "../features/authentication/authSlice";

const ProtectedRoute = () => {
  const { loginUser, isLoadingAuth } = useAppSelector(selectUserState);

  return !isLoadingAuth && loginUser ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
