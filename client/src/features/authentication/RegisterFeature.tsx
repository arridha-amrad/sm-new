import { useAppDispatch } from "../../app/hooks";
import InputPassword from "../../components/InputPassword";
import { RegisterDTO } from "./IAuthentication";
import { registerAction } from "./authSlice";
import useFormHooks from "../../utils/useFormHooks";
import MyAlert from "../../components/MyAlert";

const Register = () => {
  type LoginFieldValidator = Partial<RegisterDTO>;

  const dispatch = useAppDispatch();

  const checkField = () => {
    let errors: LoginFieldValidator = {};
    if (state.email.trim() === "") {
      errors.email = "Email field is required";
    }
    if (state.username.trim() === "") {
      errors.username = "Username field is required";
    }
    if (state.password.trim() === "") {
      errors.password = "Password field is required";
    }
    return {
      errors,
      isValid: Object.keys(errors).length <= 0,
    };
  };

  const register = async () => {
    try {
      const result = await dispatch(registerAction(state));
      if (result.meta.requestStatus === "fulfilled") {
        setAlert({
          text: result.payload as string,
          type: "success",
        });
        setState({
          ...state,
          email: "",
          password: "",
          username: "",
        });
      }
      if (result.meta.requestStatus === "rejected") {
        setAlert({
          type: "error",
          text: result.payload as string,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const {
    alert,
    fieldErrors,
    isLoading,
    onChange,
    onSubmit,
    setAlert,
    state,
    setState,
  } = useFormHooks<RegisterDTO>(
    {
      email: "",
      password: "",
      username: "",
    },
    register,
    checkField
  );

  return (
    <div>
      {!!alert && <MyAlert alert={alert} close={() => setAlert(null)} />}
      <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
        <div style={{ position: "relative" }}>
          <input
            autoComplete="off"
            value={state.email}
            name="email"
            onChange={onChange}
            className="form-control"
            placeholder="email"
            type="email"
          />
          {fieldErrors?.email && (
            <small className="text-danger">{fieldErrors.email}</small>
          )}
        </div>

        <div>
          <input
            autoComplete="off"
            value={state.username}
            name="username"
            onChange={onChange}
            className="form-control"
            placeholder="username"
            type="text"
          />
          {fieldErrors?.username && (
            <small className="text-danger">{fieldErrors.username}</small>
          )}
        </div>

        <InputPassword
          fieldError={fieldErrors?.password}
          value={state.password}
          onChange={onChange}
        />

        <button
          disabled={
            isLoading || !state.email || !state.password || !state.password
          }
          type="submit"
          className="btn btn-primary"
        >
          {isLoading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
