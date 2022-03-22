import { FC } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAuthState } from "../../features/authentication/authSlice";
import { Conversation } from "../../features/chats/IChat";

interface Props {
  selectedConversation: Conversation;
}

const ConversationHeader: FC<Props> = ({ selectedConversation }) => {
  const { loginUser } = useAppSelector(selectAuthState);
  const user = selectedConversation.users.find(
    (user) => user._id !== loginUser?._id
  );
  return (
    <div className="d-flex h-100 flex-column align-items-center justify-content-center border-bottom p-2">
      <div className="d-flex align-items-start gap-2">
        <img
          className="rounded-circle"
          alt="avatar"
          src={user!.avatarURL}
          width="30px"
          height="30px"
        />
        <div>{user!.username}</div>
        Chat id: <span>{selectedConversation._id}</span>
      </div>
      <div></div>
    </div>
  );
};

export default ConversationHeader;
