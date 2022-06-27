import { useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";
import { useAppDispatch } from "../../app/hooks";
import { getSocket } from "../../mySocket";
import queryKeys from "../../utils/queryKey";
import { logoutAction } from "./authSlice";

const Logout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const socket = getSocket();
  const { cache } = useSWRConfig();

  const onLogout = async () => {
    const result = await dispatch(logoutAction());
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/login");
      for (const key in queryKeys) {
        cache.delete(key);
      }
    }
    socket?.disconnect();
  };
  return (
    <button onClick={onLogout} className="btn btn-primary">
      Logout
    </button>
  );
};

export default Logout;
