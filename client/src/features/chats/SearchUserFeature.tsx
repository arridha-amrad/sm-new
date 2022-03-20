import { Fragment, useEffect, useRef, useState } from "react";
import Spinner from "react-bootstrap/esm/Spinner";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import SearchCard from "../../components/Chats/SearchCard";
import { searchUserAction, user } from "../user/userSlice";
import "./style.css";

const SearchUser = () => {
  const dispatch = useAppDispatch();
  const [isShowResult, setIsShowResult] = useState(false);

  const [searchKey, setSearchKey] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const { searchUser, isLoadingSearchUser } = useAppSelector(user);

  const search = async () => {
    await dispatch(searchUserAction(searchKey));
  };

  useEffect(() => {
    setIsShowResult(false);
  }, [searchKey]);

  return (
    <div className="p-3" style={{ position: "relative" }}>
      <div className="mb-3 d-flex align-items-center border-bottom pb-2">
        <input
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              setIsShowResult(true);
              search();
            }
          }}
          ref={ref}
          onChange={(e) => setSearchKey(e.target.value)}
          name="searchUser"
          className="search-input w-100"
          placeholder="search user..."
        />
        <div style={{ cursor: "pointer" }}>
          {!!searchKey ? (
            <svg
              onClick={() => {
                setSearchKey("");
                ref.current!.value = "";
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-x-lg"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
              />
              <path
                fillRule="evenodd"
                d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          )}
        </div>
      </div>

      {isShowResult && (
        <div
          style={{
            maxHeight: "400px",
            width: "100%",
            overflowY: "auto",
            position: "absolute",
            top: "4rem",
            left: "0",
            backgroundColor: "#eee",
          }}
          className="shadow-sm border"
        >
          {searchUser.length > 0 ? (
            <div className="d-flex flex-column">
              {searchUser.map((user) => (
                <Fragment key={user._id}>
                  <SearchCard searchUser={user} />
                </Fragment>
              ))}
            </div>
          ) : isLoadingSearchUser ? (
            <div className="d-flex align-items-center justify-content-center p-3">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-center p-3">
              <div>user not found</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
