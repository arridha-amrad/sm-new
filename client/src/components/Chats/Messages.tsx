import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuthState } from "../../features/authentication/authSlice";
import { selectChatState, setMessages } from "../../features/chats/chatSlice";
import { Message } from "../../features/chats/IChat";
import axiosInstance from "../../utils/axiosInterceptor";
import timeSetter from "../../utils/timeSetter";
import { Spinner } from "react-bootstrap";

import "./style.css";

const Messages = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { selectedConversation, messages } = useAppSelector(selectChatState);
  const { loginUser } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;
    const fetchMessages = async () => {
      setIsLoading(true);
      const { data } = await axiosInstance.get(
        `/api/chat/messages?conversationId=${selectedConversation?._id}`,
        {
          signal: controller.signal,
        }
      );
      dispatch(setMessages(data.messages));
      isMounted && setIsLoading(false);
    };
    fetchMessages();
    return () => {
      controller.abort();
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [selectedConversation?._id]);

  const isSentByMe = (message: Message) =>
    message.sender._id === loginUser?._id;

  const lastMessage = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastMessage.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="d-flex h-100 w-100 align-items-center justify-content-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div
      className="d-flex flex-column h-100 w-100"
      style={{ overflow: "auto" }}
    >
      <div className="flex-grow-1 d-flex flex-column p-3">
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
        <div ref={lastMessage} />
      </div>
    </div>
  );
};

export default Messages;
