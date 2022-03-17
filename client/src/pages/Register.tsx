import { Link } from "react-router-dom";
import GoogleLogin from "../components/GoogleLogin";
import RegisterForm from "../features/authentication/RegisterFeature";

const Register = () => {
  return (
    <section className="d-flex flex-column min-vh-100 overflow-hidden">
      <div className="flex-grow-1 d-flex align-items-center  justify-content-center">
        <div
          style={{ width: "400px" }}
          className="d-flex flex-column gap-3 mx-1 p-4 shadow-sm border rounded"
        >
          <h1 className="fw-bold">Register</h1>

          <RegisterForm />

          <small className=" text-center">
            Have an account?
            <Link className=" ms-1 text-decoration-none" to="/login">
              login
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

export default Register;
