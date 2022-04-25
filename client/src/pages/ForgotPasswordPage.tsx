import { Link } from "react-router-dom";
import ForgotPasswordForm from "../features/authentication/ForgotPasswordFeature";

const ForgotPasswordPage = () => {
  return (
    <section className="d-flex flex-column min-vh-100 overflow-hidden">
      <div className="flex-grow-1 d-flex align-items-center  justify-content-center">
        <div
          style={{ width: "400px" }}
          className="d-flex flex-column gap-3 p-4 border rounded shadow-sm"
        >
          <h1 className="fw-bold">Forgot Password</h1>

          <ForgotPasswordForm />

          <small className=" text-center">
            <Link className=" ms-1 text-decoration-none" to="/login">
              back to login
            </Link>
          </small>
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

export default ForgotPasswordPage;
