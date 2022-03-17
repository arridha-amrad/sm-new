import { Link } from "react-router-dom";
import GoogleLogin from "../components/GoogleLogin";
import LoginForm from "../features/authentication/LoginFeature";

const Login = () => {
  return (
    <section className="d-flex flex-column min-vh-100 overflow-hidden">
      <div className="flex-grow-1 d-flex align-items-center  justify-content-center">
        <div
          style={{ width: "400px" }}
          className="d-flex flex-column gap-3 p-4 border rounded shadow-sm"
        >
          <h1 className="fw-bold">Login</h1>

          <LoginForm />

          <small>
            Forgot password?
            <Link className=" ms-1 text-decoration-none" to="/register">
              click here
            </Link>
          </small>
          <small className=" text-center">
            Don't have an account?
            <Link className=" ms-1 text-decoration-none" to="/register">
              register
            </Link>
          </small>
          <GoogleLogin />
        </div>
      </div>
      <div className="flex-grow-0 d-flex align-items-center justify-content-center flex-column my-3">
        <p>
          Created by <span className="fw-bold">Arridha Amrad</span>
        </p>
      </div>
    </section>
  );
};

export default Login;
