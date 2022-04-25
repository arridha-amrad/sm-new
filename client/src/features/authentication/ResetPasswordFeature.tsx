import { useAppDispatch } from "../../app/hooks";
import InputPassword from "../../components/InputPassword";
import MyAlert from "../../components/MyAlert";
import useFormHooks from "../../utils/useFormHooks";
import { forgotPasswordAction } from "./authSlice";

const ResetPasswordFeature = () => {
  type FieldValidator = Partial<{ password: string }>;
  const dispatch = useAppDispatch();
  const checkField = () => {
    let errors: FieldValidator = {};
    if (state.password.trim() === "") {
      errors.password = "password field is required";
    }
    return {
      errors,
      isValid: Object.keys(errors).length <= 0,
    };
  };

  const resetPassword = async () => {
    try {
      const result = await dispatch(forgotPasswordAction(state.password));
      if (result.meta.requestStatus === "fulfilled") {
        setAlert({
          text: result.payload,
          type: "success",
        });
        setState({
          password: "",
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
  } = useFormHooks<{ password: string }>(
    {
      password: "",
    },
    resetPassword,
    checkField
  );

  return (
    <div>
      {!!alert && <MyAlert alert={alert} close={() => setAlert(null)} />}
      <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
        <InputPassword
          fieldError={fieldErrors?.password}
          value={state.password}
          onChange={onChange}
        />
        <button
          disabled={isLoading || !state.password}
          type="submit"
          className="btn btn-primary"
        >
          {isLoading ? "loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordFeature;
