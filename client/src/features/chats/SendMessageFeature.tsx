import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getSocket } from "../../socket/mySocket";
import useFormHooks from "../../utils/useFormHooks";
import {
  sendMessageAction,
  selectChatState,
  updateConversations,
} from "./chatSlice";
import "./style.css";

const SendMessageFeature = () => {
  const [isLoading, setIsLoading] = useState(false);
  const socket = getSocket();
  const { selectedConversation, selectedReceiverId, selectedReceiverUsername } =
    useAppSelector(selectChatState);
  const dispatch = useAppDispatch();

  const checkField = () => {
    let errors: { message?: string } = {};
    if (state.message.trim() === "") {
      errors.message = "Message is required";
    }
    return {
      isValid: Object.keys(errors).length > 0,
      errors,
    };
  };
  const sendChat = async () => {
    setIsLoading(true);
    const res = await dispatch(
      sendMessageAction({
        conversationId: selectedConversation?._id,
        isGroup: selectedConversation?.isGroup ?? false,
        message: state.message,
        receiverId: selectedReceiverId!,
        toUsername: selectedReceiverUsername!,
      })
    );

    if (res.meta.requestStatus === "fulfilled") {
      if (!selectedConversation?._id) {
        dispatch(
          updateConversations({
            ...res.payload.conversation,
            receiverId: selectedReceiverId,
          })
        );
      }
      setState({
        ...state,
        message: "",
      });
    }
    setIsLoading(false);
  };

  const { onChange, onSubmit, state, setState } = useFormHooks(
    {
      message: "",
    },
    sendChat,
    checkField
  );

  const [val] = useSearchParams();
  const chatId = val.get("id");

  useEffect(() => {
    setState({
      ...state,
      message: "",
    });
  }, [chatId]);

  const setTyping = () => {
    socket?.emit("setTypingCS", {
      isTyping: true,
      chatId,
      toUsername: selectedReceiverUsername,
    });
  };

  const unsetTyping = () => {
    socket?.emit("setTypingCS", {
      isTyping: false,
      chatId,
      toUsername: selectedReceiverUsername,
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="d-flex align-items-center border-top h-100 gap-3 p-3"
    >
      <textarea
        onKeyDown={setTyping}
        onBlur={unsetTyping}
        className="text-input"
        onChange={onChange}
        value={state.message}
        name="message"
        placeholder="write your message..."
      />
      <button
        onClick={sendChat}
        disabled={isLoading || !state.message}
        type="submit"
        className="btn btn-primary"
      >
        {isLoading ? <Spinner size="sm" animation="border" /> : "Send"}
      </button>
    </form>
  );
};

export default SendMessageFeature;
