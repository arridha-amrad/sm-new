import { FC, Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuthState } from "../../features/authentication/authSlice";
import { User } from "../../features/authentication/IAuthentication";
import {
  selectChatState,
  selectConversation,
  setConversations,
} from "../../features/chats/chatSlice";
import { Conversation } from "../../features/chats/IChat";
import axiosInstance from "../../utils/axiosInterceptor";
import "./style.css";

const Conversations = () => {
  const { conversations } = useAppSelector(selectChatState);
  const { loginUser } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const controller = new AbortController();
    const fetchConversations = async () => {
      const { data } = await axiosInstance.get("/api/chat/conversations", {
        signal: controller.signal,
      });
      dispatch(setConversations(data.conversations));
    };
    fetchConversations();
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Fragment>
      {conversations.map((conversation, index) => (
        <SingleConversation
          key={index}
          conversationIndex={index}
          user={conversation.users.find((user) => user._id !== loginUser?._id)!}
          conversation={conversation}
        />
      ))}
    </Fragment>
  );
};

export default Conversations;

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
          })
        );
      }}
      className={`${
        isSelected ? "bg-gray" : ""
      } d-flex align-items-center conversation gap-3 p-3 chat-partner`}
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
  );
};
