import { FC, useEffect, useRef, useState } from "react";
import CrossIcon from "../../../icons/CrossIcon";
import MySpinner from "../../MySpinner";

interface IProps {
  setSearchKey(key: string): void;
  setIsShowResult(val: boolean): void;
  isValidating: boolean;
}

const FormSearch: FC<IProps> = ({
  setSearchKey,
  setIsShowResult,
  isValidating,
}) => {
  const [key, setKey] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div className="d-flex align-items-center my-2">
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (key.trim() === "") {
              return;
            }
            setSearchKey(key);
            setIsShowResult(true);
          }
        }}
        ref={ref}
        onChange={(e) => setKey(e.target.value)}
        value={key}
        className="search-input w-100"
        placeholder="Search user..."
      />
      <div style={{ cursor: "pointer" }} onClick={() => setKey("")}>
        {isValidating ? <MySpinner isFullHeight={false} /> : <CrossIcon />}
      </div>
    </div>
  );
};

export default FormSearch;
