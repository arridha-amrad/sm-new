import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { User } from "../../features/authentication/IAuthentication";
import {
  selectChatState,
  selectConversation,
} from "../../features/chats/chatSlice";
import { Conversation } from "../../features/chats/IChat";

import "./style.css";

const SingleConversation: FC<{
  user: User;
  conversation: Conversation;
  conversationIndex: number;
}> = ({ user, conversation, conversationIndex }) => {
  const { selectedReceiverId } = useAppSelector(selectChatState);
  const isSelected = user._id === selectedReceiverId;
  const dispatch = useAppDispatch();
  return (
    <div
      onClick={() => {
        dispatch(
          selectConversation({
            ...conversation,
            receiverId: user._id,
            conversationIndex,
            receiverUsername: user.username,
          })
        );
      }}
      className={`${
        isSelected ? "bg-gray" : ""
      } d-flex align-items-center conversation gap-3 p-3 chat-partner w-100`}
    >
      <img
        src={user.avatarURL}
        alt="avatar"
        className=" img-fluid rounded-circle"
        height="30px"
        width="30px"
      />
      <div className="d-flex flex-column flex-grow-1 w-100">
        <div>{user.username}</div>
        <div className="last-message">{conversation.lastMessage}</div>
      </div>
    </div>
  );
};

export default SingleConversation;
