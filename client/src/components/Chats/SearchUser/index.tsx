import { Fragment, useEffect, useState } from "react";
import Modal from "react-bootstrap/esm/Modal";
import { User } from "../../../features/authentication/IAuthentication";
import { toast, ToastOptions } from "react-toastify";
import SearchIcon from "../../../icons/SearchIcon";
import useSWR from "swr";
import fetcher from "../../../utils/swrFetcher";
import SearchResult from "./SearchResult";
import FormSearch from "./FormSearch";
import queryKeys from "../../../utils/queryKey";

const toastOptions: ToastOptions = {
  position: "bottom-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
};

const SearchUser = () => {
  const [show, setShow] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [result, setResult] = useState<User[]>([]);

  const { data, error, isValidating } = useSWR(
    searchKey ? `${queryKeys.searchUser}?username=${searchKey}` : null,
    fetcher,
    {
      isPaused: () => !searchKey,
    }
  );

  const [isShowResult, setIsShowResult] = useState(false);

  useEffect(() => {
    if (data) {
      setResult(data.users);
    }
    if (error) {
      toast.error("Failed searching user", toastOptions);
    }
  }, [data, error]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Fragment>
      <div
        style={{ cursor: "pointer" }}
        className="text-white w-100 h-100 d-flex justify-content-center align-items-center"
        onClick={handleShow}
      >
        <SearchIcon />
        <span className="ms-2">Search User</span>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
          <FormSearch
            isValidating={isValidating}
            setIsShowResult={setIsShowResult}
            setSearchKey={setSearchKey}
          />
          {isShowResult && (
            <SearchResult result={result} closeModal={handleClose} />
          )}
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default SearchUser;
