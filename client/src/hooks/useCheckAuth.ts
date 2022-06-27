import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAppDispatch } from "../app/hooks";
import { setLoginUser } from "../features/authentication/authSlice";
import queryKey from "../utils/queryKey";
import fetcher from "../utils/swrFetcher";

const useCheckAuth = () => {
  const [loading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { data, error } = useSWR(queryKey.me, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (data) {
      dispatch(setLoginUser(data.user));
    }
    if (data || error) {
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [data, error]);

  return {
    loading,
  };
};

export default useCheckAuth;
