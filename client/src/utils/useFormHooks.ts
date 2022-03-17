import { ChangeEvent, FormEvent, useState } from "react";

export interface Alert {
  type: "success" | "error";
  text: string;
}

interface FieldValidator<T> {
  errors: Partial<T>;
  isValid: boolean;
}

const useFormHooks = <T>(
  initialState: T,
  submitAction: () => Promise<void>,
  fieldValidator: () => FieldValidator<T>
) => {
  const [state, setState] = useState(initialState);
  const [isLoading, setisLoading] = useState(false);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<T> | null>(null);
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors(null);
    const { errors, isValid } = fieldValidator();
    if (isValid) {
      setisLoading(true);
      await submitAction();
      setisLoading(false);
    } else {
      setFieldErrors(errors);
    }
  };

  return {
    state,
    onChange,
    setState,
    onSubmit,
    isLoading,
    setisLoading,
    alert,
    setAlert,
    setFieldErrors,
    fieldErrors,
  };
};

export default useFormHooks;
