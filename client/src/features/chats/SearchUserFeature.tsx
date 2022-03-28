import { Fragment, useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/esm/Modal";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Spinner from "react-bootstrap/esm/Spinner";
import Tooltip from "react-bootstrap/esm/Tooltip";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import SearchResultCard from "../../components/Chats/SearchResultCard";
import { selectAuthState } from "../authentication/authSlice";
import { User } from "../authentication/IAuthentication";
import { searchUserAction, user } from "../user/userSlice";
import { addConversation } from "./chatSlice";
import "./style.css";

const SearchUser = () => {
  const dispatch = useAppDispatch();
  const { loginUser } = useAppSelector(selectAuthState);
  const [show, setShow] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const { searchUser, isLoadingSearchUser } = useAppSelector(user);

  const search = async () => {
    await dispatch(searchUserAction(searchKey));
  };

  const [isShowResult, setIsShowResult] = useState(false);

  useEffect(() => {
    ref.current?.focus();
  }, [show]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const pickUser = (user: User) => {
    dispatch(
      addConversation({
        users: [user, loginUser!],
        isGroup: false,
      })
    );
    handleClose();
  };

  return (
    <Fragment>
      <OverlayTrigger placement="top" overlay={<Tooltip>Search User</Tooltip>}>
        <button
          style={{ cursor: "pointer" }}
          className="block bg-primary text-white btn search-btn"
          onClick={handleShow}
        >
          <svg
            style={{ marginTop: "-4px" }}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </button>
      </OverlayTrigger>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton={false}>
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                search();
                setIsShowResult(true);
              }
            }}
            ref={ref}
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
            className="search-input w-100"
            placeholder="Search user..."
          />
          <svg
            style={{ cursor: "pointer" }}
            onClick={() => setSearchKey("")}
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
        </Modal.Header>
        {isShowResult && (
          <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
            {isLoadingSearchUser && (
              <div className="d-flex justify-content-center">
                <Spinner animation="border" />
              </div>
            )}
            {searchUser.length === 0 ? (
              <div className="d-flex justify-content-center">
                <div>User not found</div>
              </div>
            ) : (
              searchUser.map((user) => (
                <Fragment key={user._id}>
                  <SearchResultCard pickUser={pickUser} user={user} />
                </Fragment>
              ))
            )}
          </Modal.Body>
        )}
      </Modal>
    </Fragment>
  );
};

export default SearchUser;
