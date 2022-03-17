import { ChangeEventHandler, FC, Fragment, useState } from "react";

interface Props {
  fieldError?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const InputPassword: FC<Props> = ({ value, onChange, fieldError }) => {
  const [isText, setIsText] = useState(false);
  return (
    <Fragment>
      <div>
        <input
          name="password"
          value={value}
          onChange={onChange}
          className="form-control"
          placeholder="password"
          type={`${isText ? "text" : "password"}`}
        />
        <small className="text-danger">{fieldError}</small>
      </div>
      <div style={{ marginTop: "-8px" }} className="form-check form-text">
        <input
          className="form-check-input"
          type="checkbox"
          id="flexCheckDefault"
          onChange={() => setIsText(!isText)}
        />
        <label className="form-check-label">Show Password</label>
      </div>
    </Fragment>
  );
};

export default InputPassword;
