import { FC, Fragment } from "react";
import { toast, ToastOptions } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectAuthState } from "../../../features/authentication/authSlice";
import { User } from "../../../features/authentication/IAuthentication";
import { addConversation } from "../../../features/chats/chatSlice";
import SearchResultCard from "../SearchResultCard";

interface IProps {
  result: User[];
  closeModal(): void;
}

const toastOptions: ToastOptions = {
  position: "bottom-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
};

const SearchResult: FC<IProps> = ({ result, closeModal }) => {
  const { loginUser } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();
  const pickUser = (user: User) => {
    if (loginUser!._id !== user._id) {
      dispatch(
        addConversation({
          users: [user, loginUser!],
          isGroup: false,
          totalUnreadMessage: 0,
        })
      );
    } else {
      toast.error("You cannot chat with your account", toastOptions);
    }
    closeModal();
  };
  return (
    <>
      {result.length === 0 ? (
        <div className="d-flex justify-content-center">
          <div>User not found</div>
        </div>
      ) : (
        result.map((user: User) => (
          <Fragment key={user._id}>
            <SearchResultCard pickUser={pickUser} user={user} />
          </Fragment>
        ))
      )}
    </>
  );
};

export default SearchResult;
