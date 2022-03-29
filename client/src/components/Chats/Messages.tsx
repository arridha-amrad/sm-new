import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuthState } from "../../features/authentication/authSlice";
import { selectChatState, setMessages } from "../../features/chats/chatSlice";
import { Message } from "../../features/chats/IChat";
import axiosInstance from "../../utils/axiosInterceptor";
import timeSetter from "../../utils/timeSetter";
import ScrollableFeed from "react-scrollable-feed";

import "./style.css";

const Messages = () => {
  const { selectedConversation, messages } = useAppSelector(selectChatState);
  const { loginUser } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const controller = new AbortController();
    const fetchMessages = async () => {
      const { data } = await axiosInstance.get(
        `/api/chat/messages?conversationId=${selectedConversation?._id}`,
        {
          signal: controller.signal,
        }
      );
      dispatch(setMessages(data.messages));
    };
    fetchMessages();
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line
  }, [selectedConversation?._id]);

  const isSentByMe = (message: Message) =>
    message.sender._id === loginUser?._id;

  return (
    <div
      className="d-flex flex-column h-100 w-100"
      style={{ overflow: "auto" }}
    >
      <ScrollableFeed
        forceScroll
        className="flex-grow-1 d-flex flex-column p-3"
      >
        {messages.map((message) => (
          <div
            key={message._id}
            style={{
              maxWidth: "400px",
            }}
            className={` ${
              isSentByMe(message)
                ? "bg-pink align-self-end"
                : "border align-self-start"
            } p-3 gap-4 rounded my-2`}
          >
            <div
              style={{
                whiteSpace: "pre-line",
                wordBreak: "break-all",
                overflowWrap: "break-word",
                width: "100%",
              }}
            >
              {message.text}
            </div>
            <small className="d-block text-secondary text-nowrap text-end">
              {timeSetter(new Date(message.createdAt))}
            </small>
          </div>
        ))}
      </ScrollableFeed>
    </div>
  );
};

export default Messages;
