import { Fragment } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { User } from "../../features/authentication/IAuthentication";
import { selectChatState, selectPartner } from "../../features/chats/chatSlice";
import "./style.css";

const ChatPartners = () => {
  const { partners, selectedPartner } = useAppSelector(selectChatState);
  const dispatch = useAppDispatch();

  const select = (user: User) => {
    dispatch(selectPartner(user));
  };

  return (
    <Fragment>
      {partners.map((user) => (
        <Fragment key={user._id}>
          <div
            onClick={() => select(user)}
            className={`${
              selectedPartner?.username === user.username ? "bg-pink" : ""
            } d-flex align-items-center gap-3 p-3 chat-partner`}
          >
            <img
              src={user.avatarURL}
              alt="avatar"
              className=" img-fluid rounded-circle"
              height="30px"
              width="30px"
            />
            <div className="d-flex flex-column">
              <div>{user.username}</div>
              <small className="text-muted">{user.fullName}</small>
            </div>
          </div>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default ChatPartners;
