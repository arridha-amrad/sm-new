import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuthState } from "../../features/authentication/authSlice";
import {
  selectChatState,
  setConversations,
} from "../../features/chats/chatSlice";
import axiosInstance from "../../utils/axiosInterceptor";
import SingleConversation from "./SingleConversation";

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
    <div className="w-100">
      {conversations.map((conversation, index) => (
        <SingleConversation
          key={index}
          conversationIndex={index}
          user={conversation.users.find((user) => user._id !== loginUser?._id)!}
          conversation={conversation}
        />
      ))}
    </div>
  );
};

export default Conversations;
