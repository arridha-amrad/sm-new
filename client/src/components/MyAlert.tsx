import { FC, MouseEventHandler } from "react";
import { Alert } from "../utils/useFormHooks";

interface Props {
  alert: Alert | null;
  close: MouseEventHandler<HTMLButtonElement>;
}

const MyAlert: FC<Props> = ({ alert, close }) => {
  return (
    <>
      {alert && (
        <div
          className={`${
            alert.type === "success"
              ? "alert-success"
              : alert.type === "error"
              ? "alert-danger"
              : ""
          } alert  alert-dismissible fade show`}
          role="alert"
        >
          {alert.text}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={close}
          ></button>
        </div>
      )}
    </>
  );
};

export default MyAlert;
