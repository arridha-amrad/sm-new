import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUserState } from "../../features/authentication/authSlice";
import { User } from "../../features/authentication/IAuthentication";
import { addChattingPartner } from "../../features/chats/chatSlice";

interface Props {
  searchUser: User;
}

const SearchCard: FC<Props> = ({ searchUser }) => {
  const dispatch = useAppDispatch();
  const { loginUser } = useAppSelector(selectUserState);

  return (
    <div
      onClick={() => {
        if (loginUser?._id !== searchUser._id) {
          dispatch(addChattingPartner(searchUser));
        }
      }}
      className="d-flex align-items-center gap-3 p-3 search-card"
      style={{ cursor: "pointer" }}
    >
      <img
        src={searchUser.avatarURL}
        className="rounded-circle img-fluid"
        alt="avatar"
        height="30px"
        width="30px"
      />
      <div className="d-flex flex-column">
        <div>{searchUser.username}</div>
        <small className=" text-muted">{searchUser.fullName}</small>
      </div>
    </div>
  );
};

export default SearchCard;
