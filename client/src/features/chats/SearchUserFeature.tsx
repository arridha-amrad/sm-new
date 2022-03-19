import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/esm/Spinner";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import useFormHooks from "../../utils/useFormHooks";
import { searchUserAction, user } from "../user/userSlice";
import "./style.css";

const SearchUser = () => {
  const [isShow, setShow] = useState(false);
  const [focus, setFocus] = useState(false);

  const [searchKey, setSearchKey] = useState("");

  const dispatch = useAppDispatch();
  const { searchUser, isLoadingSearchUser } = useAppSelector(user);

  const search = async () => {
    await dispatch(searchUserAction(state.searchUser));
  };

  const checkField = () => {
    let errors: { searchUser?: string } = {};
    if (state.searchUser.trim() === "") {
      errors.searchUser = "search keyword is required";
    }
    return {
      errors,
      isValid: Object.keys(errors).length > 0,
    };
  };

  const { fieldErrors, isLoading, onChange, onSubmit, state, setState } =
    useFormHooks(
      {
        searchUser: "",
      },
      search,
      checkField
    );

  useEffect(() => {
    if (focus && state.searchUser.trim() !== "") {
      setShow(true);
    } else {
      console.log("searching stop");
      setShow(false);
    }
  }, [focus, state.searchUser]);

  useEffect(() => {
    if (state.searchUser !== "") {
      setTimeout(() => {
        setSearchKey(state.searchUser);
      }, 2000);
    }
  }, [state.searchUser]);

  useEffect(() => {
    search();
  }, [searchKey]);

  return (
    <div className="p-3">
      <form onSubmit={onSubmit}>
        <div className="mb-3 d-flex align-items-center border-bottom pb-2">
          <input
            onChange={onChange}
            onKeyUp={() => console.log("down")}
            value={state.searchUser}
            name="searchUser"
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
            className="search-input w-100"
            placeholder="search user..."
          />
          <div style={{ cursor: "pointer" }}>
            {isShow ? (
              <svg
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
                  fill-rule="evenodd"
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
      </form>

      {isShow && (
        <div
          style={{ maxHeight: "400px", width: "100%" }}
          className="shadow-sm border"
        >
          {searchUser.length > 0 ? (
            <div className="d-flex flex-column">
              {searchUser.map((user) => (
                <>
                  <div
                    className="d-flex align-items-center gap-3 search-card p-3"
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={user.avatarURL}
                      className="rounded-circle img-fluid"
                      alt="avatar"
                      height="30px"
                      width="30px"
                    />
                    <div className="d-flex flex-column">
                      <div>{user.username}</div>
                      <small className=" text-muted">{user.fullName}</small>
                    </div>
                  </div>
                </>
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
