import { Fragment, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/esm/Modal";
import Spinner from "react-bootstrap/esm/Spinner";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import SearchCard from "../../components/Chats/SearchCard";
import { selectAuthState } from "../authentication/authSlice";
import { User } from "../authentication/IAuthentication";
import { searchUserAction, user } from "../user/userSlice";
import { addChattingPartner } from "./chatSlice";
import "./style.css";

const SearchUser = () => {
  const dispatch = useAppDispatch();
  const { loginUser } = useAppSelector(selectAuthState);
  const [selectUser, setSelectUser] = useState<User[]>([]);
  const [show, setShow] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const { searchUser, isLoadingSearchUser } = useAppSelector(user);

  const search = async () => {
    await dispatch(searchUserAction(searchKey));
  };

  useEffect(() => {
    dispatch(searchUserAction(searchKey));
  }, []);

  useEffect(() => {
    ref.current?.focus();
  }, [show]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const pickUser = (user: User) => {
    const idx = selectUser.findIndex((usr) => usr._id === user._id);
    if (idx < 0) {
      setSelectUser([...selectUser, user]);
    } else {
      selectUser.splice(idx, 1);
    }
  };

  const addChatPartner = () => {
    selectUser.forEach((usr) => {
      if (usr._id !== loginUser?._id) {
        dispatch(addChattingPartner(usr));
      }
    });
    handleClose();
  };

  return (
    <Fragment>
      <button
        style={{ cursor: "pointer" }}
        className="block bg-primary text-white btn"
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
        <span className="ms-1">Search User</span>
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton={false}>
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                search();
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
                <SearchCard pickUser={pickUser} user={user} />
              </Fragment>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={addChatPartner}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default SearchUser;
