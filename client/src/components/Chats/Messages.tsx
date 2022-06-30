import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuthState } from "../../features/authentication/authSlice";
import { selectChatState, setMessages } from "../../features/chats/chatSlice";
import { Message } from "../../features/chats/IChat";

import timeSetter from "../../utils/timeSetter";

import "./style.css";
import useSWR from "swr";
import queryKeys from "../../utils/queryKey";
import fetcher from "../../utils/swrFetcher";
import MySpinner from "../MySpinner";
import { useSearchParams } from "react-router-dom";

const Messages = () => {
  const { messages } = useAppSelector(selectChatState);
  const { loginUser } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const [val] = useSearchParams();

  const { data, error, isValidating } = useSWR(
    val.get("id")
      ? `${queryKeys.messages}?conversationId=${val.get("id")}`
      : null,
    fetcher
  );

  useEffect(() => {
    if (data) {
      dispatch(setMessages(data.messages));
    }
    // eslint-disable-next-line
  }, [data, error]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

  const isSentByMe = (message: Message) =>
    message.sender._id === loginUser?._id;

  if (isValidating) {
    return (
      <div className="d-flex h-100 w-100 align-items-center justify-content-center">
        <MySpinner isFullHeight={false} />
      </div>
    );
  }

  return (
    <div
      className="d-flex flex-column h-100 w-100"
      style={{ overflow: "auto" }}
    >
      <div className="flex-grow-1 d-flex flex-column p-3 h-100">
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
        <div ref={lastMessageRef} />
      </div>
    </div>
  );
};

export default Messages;
