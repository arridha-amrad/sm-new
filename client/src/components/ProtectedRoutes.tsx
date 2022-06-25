import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectAuthState,
  setLoginUser,
} from '../features/authentication/authSlice';

import AppBar from './AppBar';
import useSWR from 'swr';
import MySpinner from './MySpinner';
import fetcher from '../utils/swrFetcher';
import queryKey from '../utils/queryKey';

const ProtectedRoute = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { loginUser, isLoadingAuth } = useAppSelector(selectAuthState);

  const { data } = useSWR(loginUser ? null : queryKey.me, fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (data) {
      dispatch(setLoginUser(data.user));
    }
    // eslint-disable-next-line
  }, [data]);

  if (isLoadingAuth) {
    return <MySpinner />;
  }

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
