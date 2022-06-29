import { useAppDispatch } from "../../app/hooks";
import MyAlert from "../../components/MyAlert";
import useFormHooks from "../../utils/useFormHooks";
import { forgotPasswordAction } from "../authentication/authSlice";

const ForgotPasswordFeature = () => {
  type FieldValidator = Partial<{ email: string }>;
  const dispatch = useAppDispatch();
  const checkField = () => {
    let errors: FieldValidator = {};
    if (state.email.trim() === "") {
      errors.email = "email field is required";
    }
    return {
      errors,
      isValid: Object.keys(errors).length <= 0,
    };
  };

  const sendResetPasswordRequest = async () => {
    try {
      const result = await dispatch(forgotPasswordAction(state.email));
      if (result.meta.requestStatus === "fulfilled") {
        setAlert({
          text: result.payload,
          type: "success",
        });
        setState({
          email: "",
        });
      }
    } catch (err) {
      console.log("err login : ", err);
    }
  };

  const {
    onChange,
    state,
    alert,
    isLoading,
    setAlert,
    onSubmit,
    fieldErrors,
    setState,
  } = useFormHooks<{ email: string }>(
    {
      email: "",
    },
    sendResetPasswordRequest,
    checkField
  );

  return (
    <div>
      {!!alert && <MyAlert alert={alert} close={() => setAlert(null)} />}
      <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
        <div>
          <input
            value={state.email}
            name="email"
            onChange={onChange}
            className="form-control"
            placeholder="email"
            type="text"
          />
          {fieldErrors?.email && (
            <small className="text-danger">{fieldErrors.email}</small>
          )}
        </div>
        <button
          disabled={isLoading || !state.email}
          type="submit"
          className="btn btn-primary"
        >
          {isLoading ? "loading..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordFeature;
