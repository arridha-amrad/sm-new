import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { logoutAction } from "./authSlice";

const Logout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    const result = await dispatch(logoutAction());
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/login");
    }
  };
  return (
    <button onClick={onLogout} className="btn btn-primary">
      Logout
    </button>
  );
};

export default Logout;
