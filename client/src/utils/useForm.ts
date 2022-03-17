import { ChangeEvent, useState } from "react";

const useForm = <T>(initialState: T) => {
  const [state, setState] = useState(initialState);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  return {
    state,
    onChange,
    setState,
  };
};

export default useForm;
