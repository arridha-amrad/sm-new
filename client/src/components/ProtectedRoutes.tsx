import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectAuthState } from '../features/authentication/authSlice';

import AppBar from './AppBar';

const ProtectedRoute = () => {
  const { loginUser } = useAppSelector(selectAuthState);
  const location = useLocation();

  return loginUser ? (
    <>
      <AppBar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
